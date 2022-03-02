<script lang="ts">
  export let amount: number;

  const clamp = (num: number, min: number, max: number) =>
    Math.min(Math.max(num, min), max);

  $: transformY = -130 * (clamp(amount, 0, 100) / 100);
</script>

<svg id="svg66" viewBox="0 0 276 416" version="1.1" width="100%" height="auto">
  <defs id="defs70">
    <mask maskUnits="userSpaceOnUse" id="water-mask">
      <path
        style="fill:#ffffff;fill-opacity:1;stroke:#101010;stroke-width:3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:9.5;stroke-dasharray:none;stroke-opacity:1"
        d="m 53.58336,582.80697 v -156.845 c 10.0862,-0.37 18.0618,-0.377 22.6793,-2.626 8.5046,-4.569 9.0347,-4.829 20.292,-6.685 12.971,-0.342 23.0772,7.242 45.83621,9.311 14.722,0.69 21.804,-7.64 33.183,-7.64 15.49,-1.273 23.794,0.796 36.049,2.388 16.788,3.221 21.167,-0.239 31.034,0 16.133,1.75 20.292,5.411 32.229,5.252 v 156.368 z"
        id="path1930"
        mask="none"
        clip-path="none"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="translate"
          values="0 {transformY}; -50 {transformY}; 0 {transformY}"
          dur="3s"
          calcMode="spline"
          keySplines="0.4 0 0.2 0.8; 0.4 0 0.2 1"
          repeatCount="indefinite"
        />
      </path>
    </mask>
  </defs>
  <g id="layer1" style="display:inline">
    <g id="g1507">
      <path
        d="m 148.869,116.1 c 0,0 -23.98,83.135 -13.469,137.537"
        fill="none"
        stroke="#101010"
        stroke-miterlimit="10"
        stroke-width="3.12155"
        id="path2"
        style="stroke-width:3;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <path
        d="m 176.281,95.6597 c 26.356,-17.06 4.753,-28.7855 4.753,-28.7855 -17.165,-10.9332 -23.451,15.634 -23.451,15.634 l 0.581,-5.8628 c 0,0 -1.003,-28.3101 -22.024,-22.0248 0,0 -23.082,6.919 0.686,30.5284 -30.581,-12.6233 -28.627,12.5178 -28.627,12.5178 0.634,19.4892 28.469,7.8172 28.469,7.8172 0,0 -27.254,7.447 -17.483,23.82 0,0 11.884,21.55 28.733,-4.964 -2.641,31.32 19.859,21.391 19.859,21.391 20.388,-8.134 0.528,-29.525 0.528,-29.525 0,0 21.55,19.648 29.525,-0.793 0,-0.052 9.719,-22.6583 -21.549,-19.7533 z"
        fill="#b85d70"
        stroke="#101010"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="3.12155"
        id="path4"
        style="stroke-width:3;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <circle
        cx="152.8298"
        cy="99.885101"
        r="9.6655865"
        fill="#f28e25"
        stroke="#101010"
        stroke-miterlimit="10"
        stroke-width="1.56075"
        id="circle6"
      />
      <path
        d="m 212.144,62.3319 c 0,0 -12.888,122.5361 -32.641,191.3051"
        fill="none"
        stroke="#101010"
        stroke-miterlimit="10"
        stroke-width="3.12155"
        id="path8"
        style="stroke-width:3;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <path
        d="m 238.764,39.2507 c 24.137,-20.0706 1.267,-29.1552 1.267,-29.1552 -18.327,-8.82053 -21.444,18.2748 -21.444,18.2748 l -0.105,-5.8627 c 0,0 -4.331,-27.99326 -24.507,-19.27838 0,0 -22.078,9.61278 4.331,30.26438 -31.849,-8.9261 -26.99,15.7924 -26.99,15.7924 2.958,19.2784 29.208,4.3839 29.208,4.3839 0,0 -26.145,10.6163 -14.525,25.722 0,0 14.366,19.965 27.941,-8.3451 1.056,31.3732 22.236,18.8558 22.236,18.8558 19.278,-10.4578 -2.958,-29.3665 -2.958,-29.3665 0,0 23.768,16.9544 29.208,-4.2782 0.106,-0.0528 7.025,-23.6094 -23.662,-17.0072 z"
        fill="#d97c93"
        stroke="#101010"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="3.12155"
        id="path10"
        style="stroke-width:3;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <circle
        cx="215.99944"
        cy="46.222595"
        r="9.6655865"
        fill="#f5a45b"
        stroke="#101010"
        stroke-miterlimit="10"
        stroke-width="1.56075"
        id="circle12"
      />
      <path
        d="m 136.034,225.221 c 0,0 -22.606,-37.659 39.296,-46.796 2.377,62.535 -39.296,46.796 -39.296,46.796 z"
        fill="#96c456"
        stroke="#101010"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="3.12155"
        id="path14"
        style="stroke-width:3;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <path
        d="m 77.0368,68.5644 c 0,0 12.8875,122.5366 32.6412,191.3046"
        fill="none"
        stroke="#101010"
        stroke-miterlimit="10"
        stroke-width="3.12155"
        id="path16"
        style="stroke-width:3;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <path
        d="m 197.038,179.481 c 0,0 -8.292,-62.061 77.853,-39.032 -32.166,83.187 -77.853,39.032 -77.853,39.032 z"
        fill="#96c456"
        stroke="#101010"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="3.12155"
        id="path18"
        style="stroke-width:3;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <line
        x1="200.68283"
        x2="245.36638"
        y1="178.31892"
        y2="156.9807"
        id="line20"
        style="fill:none;stroke:#101010;stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none"
      />
      <path
        d="m 233.165,178.213 c -2.06,-0.633 -17.747,-6.919 -17.747,-6.919 l 6.972,-17.43"
        id="path22"
        style="fill:none;stroke:#101010;stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none"
      />
      <polyline
        points="492 353.3 465.1 343.2 471.5 317.1"
        id="polyline24"
        style="fill:none;stroke:#101010;stroke-width:2.35751;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none"
        transform="matrix(0.46659384,0,0,0.46659384,15.646457,3.3424319)"
      />
      <path
        d="M 50.364,45.4832 C 26.2265,25.4125 49.0964,16.3279 49.0964,16.3279 67.424,7.50743 70.5403,34.6028 70.5403,34.6028 L 70.6459,28.74 c 0,0 4.331,-27.993201 24.5073,-19.27833 0,0 22.0778,9.61273 -4.331,30.26443 31.8488,-8.9262 26.9898,15.7924 26.9898,15.7924 -2.958,19.2783 -29.2082,4.3838 -29.2082,4.3838 0,0 26.1442,10.6163 14.5252,25.7221 0,0 -14.3667,19.9646 -27.9408,-8.3452 -1.0563,31.3738 -22.2361,18.8559 -22.2361,18.8559 -19.2784,-10.4579 2.9578,-29.3665 2.9578,-29.3665 0,0 -23.7679,16.9544 -29.2081,-4.2782 -0.0528,0 -7.0247,-23.6094 23.6622,-17.0072 z"
        fill="#db5b7c"
        stroke="#101010"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="3.12155"
        id="path28"
        style="stroke-width:3;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <circle
        cx="73.128326"
        cy="52.455048"
        r="9.6655865"
        fill="#f3a157"
        stroke="#101010"
        stroke-miterlimit="10"
        stroke-width="1.56075"
        id="circle30"
      />
      <path
        d="m 86.7024,164.375 c 0,0 9.0846,-67.8702 -85.14168,-42.676 35.17638,91.004 85.14168,42.676 85.14168,42.676 z"
        fill="#96c456"
        stroke="#101010"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="3.12155"
        id="path32"
        style="stroke-width:3;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <line
        x1="82.741531"
        x2="33.832603"
        y1="163.16034"
        y2="139.81502"
        id="line34"
        style="fill:none;stroke:#101010;stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none"
      />
      <path
        d="m 47.195,163.002 c 2.2183,-0.687 19.384,-7.606 19.384,-7.606 l -7.6586,-19.067"
        id="path36"
        style="fill:none;stroke:#101010;stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none"
      />
      <polyline
        points="90.9 322.9 120.4 311.8 113.4 283.3"
        id="polyline38"
        style="fill:none;stroke:#101010;stroke-width:2.24972;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none"
        transform="matrix(0.48895006,0,0,0.48895006,-11.920882,-6.2207736)"
      />
      <polygon
        points="222.49588,288.0734 138.25213,288.0734 53.955559,288.0734 78.51565,415.2577 138.25213,415.2577 197.93579,415.2577 "
        stroke="#101010"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="5.9101"
        id="polygon42"
        mask="url(#water-mask)"
        clip-path="none"
        style="fill:#0d7dba;fill-opacity:1;stroke-width:3;stroke-miterlimit:10;stroke-dasharray:none"
        transform="translate(5.01442e-4,6.039483e-4)"
      />
      <polygon
        points="222.49638,288.074 138.25263,288.074 53.956059,288.074 78.51615,415.2583 138.25263,415.2583 197.93629,415.2583 "
        fill="#00000000"
        stroke="#101010"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="5.9101"
        id="polygon42-4"
        mask="none"
        clip-path="none"
        style="display:inline;fill:none;fill-opacity:1;stroke-width:3;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <polyline
        points="288.9 578.6 478.3 578.6 478.3 501 288.9 501 99.4 501 99.4 578.6 288.9 578.6"
        fill="#e09b52"
        stroke="#101010"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="5.9101"
        id="polyline44"
        transform="matrix(0.52961457,0,0,0.53571228,-14.588577,-21.558801)"
        style="stroke-width:5.63217;stroke-miterlimit:9.5;stroke-dasharray:none"
      />
      <polygon
        points="56.17389,289.71074 75.188154,289.71074 101.80812,413.62036 79.836085,413.62036 "
        fill-opacity="0.16317"
        id="polygon46"
        transform="matrix(0.98427659,0,0,0.98427659,2.3182967,5.5119419)"
      />
      <polygon
        points="215.62962,289.65793 190.75263,413.56755 196.61536,413.56755 221.17545,289.65793 "
        fill="#ffffff"
        fill-opacity="0.56177"
        id="polygon48"
        transform="matrix(0.97613339,0,0,0.97613339,2.6477799,8.3482042)"
      />
      <polygon
        points="67.582448,286.59452 40.064583,286.59452 40.064583,248.61881 59.659838,248.61881 "
        fill="#b0733a"
        id="polygon50"
      />
      <polygon
        points="221.17545,286.59452 236.43968,286.59452 236.43968,248.61881 228.83397,248.61881 "
        fill="#f7b980"
        id="polygon52"
      />
      <line
        x1="138.30547"
        x2="161.17538"
        y1="223.47781"
        y2="197.28038"
        id="line54"
        style="fill:none;stroke:#101010;stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none"
      />
      <path
        d="m 159.221,214.34 c -1.479,0.159 -13.363,0.476 -13.363,0.476 l -0.37,-13.152"
        id="path56"
        style="fill:none;stroke:#101010;stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none"
      />
      <polyline
        points="338.9 421.3 318.7 422.3 315.6 403.7"
        id="polyline58"
        style="fill:none;stroke:#101010;stroke-width:2.19989;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none"
        transform="matrix(0.50002601,0,0,0.50002601,-5.8725261,-5.4889779)"
      />
      <path
        style="fill:none;stroke:#000000;stroke-width:1.99627;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="M 230.612,337.325 Z"
        id="path1821"
      />
    </g>
  </g>
</svg>

<style lang="sass">
  svg
    filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.3))
    -webkit-filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.3))
</style>
