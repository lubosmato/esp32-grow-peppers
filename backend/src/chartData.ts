import EventEmitter from "events"
import { Database } from "sqlite";
import { Plant } from "./api/devices";

export interface PureSample {
  time: number
  value: number
  key: "water" | "temp"
}

export interface Sample {
  id?: number
  plantId: string
  key: "water" | "temp"
  time: number
  value: number
}

interface Filter {
  addSample: (sample: number) => void
  stop: () => void
}

function createAveragingFilter(outputSamplingPeriod: number, callback: (average: number) => void): Filter {
  let average = 0
  let count = 0

  const filterInterval = setInterval(() => {
    if (count === 0) return

    callback(average)

    count = 1
  }, outputSamplingPeriod)

  return {
    addSample(sample: number) {
      count++
      average = (1 / count) * sample + (1 - 1 / count) * average
    },
    stop() {
      clearInterval(filterInterval)
    }
  }
}

export function useDataStoring(emitter: EventEmitter, db: Database) {
  const resamplingPeriod = 10 * 60 * 1000 // 10 minutes

  const waterFilters = new Map<string, Filter>()
  const tempFilters = new Map<string, Filter>()

  emitter.addListener("plant", (plant: Plant) => {
    let waterFilter = waterFilters.get(plant.id)
    if (!waterFilter) {
      waterFilter = createAveragingFilter(resamplingPeriod, (average) => {
        storeSample(db, {
          key: "water",
          plantId: plant.id,
          time: Date.now(),
          value: average,
        })
      })
    }
    if (plant.water)
      waterFilter.addSample(plant.water)
    waterFilters.set(plant.id, waterFilter)

    let tempFilter = tempFilters.get(plant.id)
    if (!tempFilter) {
      tempFilter = createAveragingFilter(resamplingPeriod, (average) => {
        storeSample(db, {
          key: "temp",
          plantId: plant.id,
          time: Date.now(),
          value: average,
        })
      })
    }
    if (plant.temperature)
      tempFilter.addSample(plant.temperature)
    tempFilters.set(plant.id, tempFilter)
  })

  const deleteTwoDaysOldSamples = () => {
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    deleteOldSamples(db, twoDaysAgo)
  }

  const deleteOldSamplesPeriod = 30 * 60 * 1000 // 30 minutes
  setInterval(deleteTwoDaysOldSamples, deleteOldSamplesPeriod)
}

export async function getSamples(db: Database, plantId: string): Promise<Sample[]> {
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  return await db.all<Sample>(`
    SELECT * FROM chart_data 
    WHERE plantId = ? AND time > ?
    ORDER BY time ASC
  `, [plantId, twoDaysAgo.getTime()])
}

export async function storeSample(db: Database, sample: Sample) {
  await db.run(`
    INSERT INTO chart_data 
      (plantId, key, time, value)
    VALUES 
      (?, ?, ?, ?)
  `, [sample.plantId, sample.key, sample.time, sample.value])
}

export async function deleteOldSamples(db: Database, olderThan: Date) {
  console.log("deleting old chart data older than", olderThan)
  await db.run(`
    DELETE FROM chart_data 
    WHERE time < ?
  `, [olderThan.getTime()])
}
