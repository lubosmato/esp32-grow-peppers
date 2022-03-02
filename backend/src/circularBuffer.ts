// YAGNI
export class CircularBuffer<T> {

  private data: T[]
  private capacity: number
  private head: number
  private tail: number

  constructor(capacity: number) {
    this.capacity = capacity + 1
    this.data = []
    this.data.length = this.capacity
    this.head = 0
    this.tail = 0
  }

  public push(value: T) {
    this.data[this.head % this.capacity] = value
    this.head = this.incrementIndex(this.head)
    if (this.head === this.tail) {
      this.tail = this.incrementIndex(this.tail)
    }
  }

  private incrementIndex(index: number) {
    return (index + 1) % this.capacity
  }

  public isEmpty() {
    return this.tail === this.head
  }

  public isFull() {
    return this.incrementIndex(this.head) === this.tail
  }

  public *[Symbol.iterator]() {
    for (let i = this.tail; i !== this.head; i = this.incrementIndex(i)) {
      yield this.data[i]
    }
  }

  public pop(): T {
    if (this.isEmpty()) throw new Error("Can't pop when buffer is empty")

    const value = this.data[this.tail]
    this.tail = this.incrementIndex(this.tail)
    return value
  }
}

function assert(condition: boolean) {
  if (!condition) throw new Error("You shall not pass!")
}

function testCircularBuffer() {
  const buffer = new CircularBuffer<number>(3)

  console.log(Array.from(buffer))
  assert(buffer.isEmpty())
  assert(!buffer.isFull())
  assert(Array.from(buffer).length === 0)

  buffer.push(1)
  console.log(Array.from(buffer))
  assert(!buffer.isEmpty())
  assert(!buffer.isFull())
  assert(Array.from(buffer).length === 1)

  buffer.push(2)
  console.log(Array.from(buffer))
  assert(!buffer.isEmpty())
  assert(!buffer.isFull())
  assert(Array.from(buffer).length === 2)

  assert(buffer.pop() === 1)
  console.log(Array.from(buffer))
  assert(!buffer.isEmpty())
  assert(!buffer.isFull())
  assert(Array.from(buffer).length === 1)

  buffer.push(1)
  console.log(Array.from(buffer))
  assert(!buffer.isEmpty())
  assert(!buffer.isFull())
  assert(Array.from(buffer).length === 2)

  buffer.push(2)
  console.log(Array.from(buffer))
  assert(!buffer.isEmpty())
  assert(buffer.isFull())
  assert(Array.from(buffer).length === 3)

  assert(buffer.pop() === 2)
  console.log(Array.from(buffer))
  assert(!buffer.isEmpty())
  assert(!buffer.isFull())
  assert(Array.from(buffer).length === 2)

  buffer.push(3)
  console.log(Array.from(buffer))
  assert(!buffer.isEmpty())
  assert(buffer.isFull())
  assert(Array.from(buffer).length === 3)

  buffer.push(4)
  console.log(Array.from(buffer))
  assert(!buffer.isEmpty())
  assert(buffer.isFull())
  assert(Array.from(buffer).length === 3)

  assert(buffer.pop() === 2)
  console.log(Array.from(buffer))
  assert(!buffer.isEmpty())
  assert(!buffer.isFull())
  assert(Array.from(buffer).length === 2)

  assert(buffer.pop() === 3)
  console.log(Array.from(buffer))
  assert(!buffer.isEmpty())
  assert(!buffer.isFull())
  assert(Array.from(buffer).length === 1)

  assert(buffer.pop() === 4)
  console.log(Array.from(buffer))
  assert(buffer.isEmpty())
  assert(!buffer.isFull())
  assert(Array.from(buffer).length === 0)

  try {
    buffer.pop()
    assert(false)
  } catch (e) {
    assert(true)
  }

  console.log("all tests passed!")
}

// testCircularBuffer()

function useAveragingFilter(outputSamplingPeriod: number, callback: (average: number) => void) {
  let average = 0
  let count = 0

  const filterInterval = setInterval(() => {
    callback(average)
    
    count = 0
    average = 0

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

async function testFilter() {
  const filter = useAveragingFilter(1000, (sample) => {
    console.log(sample)
  })

  let i = 0
  setInterval(() => {
    filter.addSample(i++)
  }, 100)

  await new Promise((resolve) => setTimeout(resolve, 10000))
  filter.stop()
  await new Promise((resolve) => setTimeout(resolve, 2000))
  process.exit(0)
}

testFilter()
