<script lang="ts">
  import { clamp } from "../helpers";

  export let opacity;

  $: clampedOpacity = clamp(opacity, 0.0, 1.0);
</script>

<svg
  version="1.1"
  viewBox="0 0 23.184829 34.36628"
  height="100%"
  width="100%"
  style={`filter: drop-shadow(0px 0px 8px rgba(255, 0, 255, ${clampedOpacity}));-webkit-filter: drop-shadow(0px 0px 8px rgba(255, 0, 255, ${clampedOpacity}))`}
>
  <defs>
    <mask maskUnits="userSpaceOnUse">
      <path
        style="display:inline;fill:#fffffe;fill-opacity:1;stroke:#ffffff;stroke-width:0.499999;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.613054"
        d="M 14.36543,70.110088 V 35.589189 c 0,-1.4634 -1.1375,-1.7965 -2.5353,-1.7965 -1.3988,0 -2.62913,0.425998 -2.62913,1.889599 v 34.4278 z"
      />
    </mask>
  </defs>
  <g style="display:inline">
    <g>
      <g>
        <path
          d="m 22.788,11.5927 c 0,-6.1833 -5.0125,-11.1958 -11.1955,-11.1958 -6.18362,0 -11.195625,5.0125 -11.195625,11.1958 0,3.134 1.289055,5.9658 3.364705,7.9983 1.78752,1.9839 2.87919,4.608 2.87919,7.4885 h 9.90363 c 0,-2.8816 1.0914,-5.5046 2.8795,-7.4885 2.0748,-2.0322 3.3641,-4.8643 3.3641,-7.9983 z"
          style={`fill:#ff00ff;fill-opacity:${clampedOpacity};stroke:none;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;paint-order:normal`}
        />
        <path
          d="m 11.5922,1.8293 c 5.9423,0 10.8008,4.6307 11.1704,10.4796 C 22.778,12.0718 22.788,11.8335 22.788,11.5927 22.788,5.4094 17.7755,0.39689996 11.5925,0.39689996 5.40888,0.39689996 0.396875,5.4094 0.396875,11.5927 c 0,0.2408 0.010318,0.4794 0.025135,0.7162 C 0.791368,6.46 5.6499,1.8293 11.5922,1.8293 Z"
          style="fill:#ffffff;fill-opacity:0.560784;stroke:none;stroke-width:0.79375;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers"
        />
        <path
          d="m 22.788,11.592675 c 0,-6.1833 -5.0125,-11.19580001 -11.1955,-11.19580001 -6.18362,0 -11.19562501,5.01250001 -11.19562501,11.19580001 0,3.134 1.28905501,5.9658 3.36470501,7.9983 1.78752,1.9839 2.87919,4.608 2.87919,7.4885 h 9.90363 c 0,-2.8816 1.0914,-5.5046 2.8795,-7.4885 2.0748,-2.0322 3.3641,-4.8643 3.3641,-7.9983 z"
          style="display:inline;fill:none;fill-opacity:0.643137;stroke:#33363a;stroke-width:0.79375;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:normal"
        />
        <path
          d="m 14.2582,30.484 c 0,-0.4045 -0.0881,-0.7628 -0.2241,-1.0046 0.136,-0.2424 0.2241,-0.6001 0.2241,-1.0046 0,-0.7292 -0.2802,-1.3208 -0.6252,-1.3208 H 9.77322 c -0.34528,0 -0.62521,0.5916 -0.62521,1.3208 0,0.4045 0.08837,0.7622 0.22437,1.0046 -0.136,0.2418 -0.22437,0.6001 -0.22437,1.0046 0,0.4051 0.08837,0.7628 0.22437,1.0046 -0.136,0.2429 -0.22437,0.6007 -0.22437,1.0052 0,0.7292 0.2802,1.3203 0.62521,1.3203 H 13.633 c 0.3453,0 0.6252,-0.5911 0.6252,-1.3203 0,-0.4045 -0.0881,-0.7623 -0.2241,-1.0052 0.136,-0.242 0.2241,-0.5995 0.2241,-1.0046 z"
          style="stroke:none;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:#f4ab0b;fill-opacity:1"
        />
        <path
          d="m 17.1446,30.717 c 0,-0.4045 -0.186,-0.7628 -0.4733,-1.0046 0.2873,-0.2424 0.4733,-0.6001 0.4733,-1.0046 0,-0.7292 -0.5916,-1.3208 -1.3207,-1.3208 H 7.67077 c -0.7292,0 -1.32027,0.5916 -1.32027,1.3208 0,0.4045 0.18573,0.7622 0.47281,1.0046 -0.28708,0.2418 -0.47281,0.6001 -0.47281,1.0046 0,0.4051 0.18573,0.7628 0.47281,1.0046 -0.28708,0.2429 -0.47281,0.6007 -0.47281,1.0052 0,0.7292 0.59107,1.3203 1.32027,1.3203 h 8.15283 c 0.7292,0 1.3208,-0.5911 1.3208,-1.3203 0,-0.4045 -0.186,-0.7623 -0.4734,-1.0052 0.2876,-0.242 0.4736,-0.5995 0.4736,-1.0046 z"
          style="stroke:none;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:#ffbf31;fill-opacity:0.62004662"
        />
        <path
          d="m 16.9894,30.6393 c 0,-0.4045 -0.186,-0.7628 -0.4733,-1.0046 0.2873,-0.2424 0.4733,-0.6001 0.4733,-1.0046 0,-0.7292 -0.5916,-1.3208 -1.3207,-1.3208 H 7.51548 c -0.72919,0 -1.32026,0.5916 -1.32026,1.3208 0,0.4045 0.18573,0.7622 0.47281,1.0046 -0.28709,0.2418 -0.47281,0.6001 -0.47281,1.0046 0,0.4051 0.18573,0.7628 0.47281,1.0046 -0.28709,0.2429 -0.47281,0.6007 -0.47281,1.0052 0,0.7292 0.59107,1.3203 1.32026,1.3203 h 8.15292 c 0.7292,0 1.3208,-0.5911 1.3208,-1.3203 0,-0.4045 -0.186,-0.7623 -0.4734,-1.0052 0.2876,-0.242 0.4736,-0.5995 0.4736,-1.0046 z"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none;fill-opacity:1"
        />
        <path
          d="m 21.5858,13.2561 c 0,-5.5195 -4.4746,-9.9935 -9.9936,-9.9935 -5.51923,0 -9.99359,4.474 -9.99359,9.9935 0,2.7975 1.15146,5.3247 3.00381,7.1393 1.59543,1.7703 2.56989,4.1129 2.56989,6.6844 h 8.83999 c 0,-2.5715 0.9742,-4.9139 2.5699,-6.6844 1.8524,-1.8146 3.0036,-4.3418 3.0036,-7.1393 z"
          style="fill:#000000;fill-opacity:0.10196079;stroke:none;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round"
        />
        <line
          x1="11.334916"
          y1="29.540627"
          x2="16.327238"
          y2="29.540627"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <line
          x1="6.7868166"
          y1="31.584328"
          x2="8.8251276"
          y2="31.584328"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <line
          x1="10.359999"
          y1="31.54744"
          x2="10.359999"
          y2="31.54744"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <line
          x1="11.894063"
          y1="31.54744"
          x2="11.894063"
          y2="31.54744"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <path
          d="m 22.788,11.5927 c 0,-6.1833 -5.0125,-11.1958 -11.1955,-11.1958 -6.18362,0 -11.195625,5.0125 -11.195625,11.1958 0,3.134 1.289055,5.9658 3.364705,7.9983 1.78752,1.9839 2.87919,4.608 2.87919,7.4885 h 9.90363 c 0,-2.8816 1.0914,-5.5046 2.8795,-7.4885 2.0748,-2.0322 3.3641,-4.8643 3.3641,-7.9983 z"
          style="fill:none;fill-opacity:0.64313728;stroke:none;stroke-width:0.79375;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
        />
        <path
          d="m 17.4575,15.5215 c 0,-3.2396 -2.6263,-5.8658 -5.8653,-5.8658 -3.23958,0 -5.86557,2.6262 -5.86557,5.8658 0,1.6412 0.67548,3.1255 1.76265,4.1899 0.93663,1.0393 1.50812,5.8592 1.50812,7.3681 h 5.1888 c 0,-1.5089 0.5718,-6.3288 1.5084,-7.3681 1.0872,-1.0644 1.7629,-2.5487 1.7629,-4.1899 z"
          style="fill:#000000;fill-opacity:0.15294118;stroke:none;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round"
        />
        <line
          x1="13.428144"
          y1="31.54744"
          x2="13.428144"
          y2="31.54744"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <line
          x1="11.582935"
          y1="2.2456052"
          x2="11.582935"
          y2="2.4485662"
          style="fill:none;fill-opacity:0.512821;stroke:#ffffff;stroke-opacity:0.4778555;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round"
        />
        <line
          x1="11.582935"
          y1="4.2946053"
          x2="11.582935"
          y2="5.4849625"
          style="fill:none;fill-opacity:0.512821;stroke:#ffffff;stroke-opacity:0.4778555;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round"
        />
        <line
          x1="5.8507233"
          y1="4.1846051"
          x2="5.994113"
          y2="4.3279939"
          style="fill:none;fill-opacity:0.512821;stroke:#ffffff;stroke-opacity:0.4778555;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round"
        />
        <line
          x1="7.2999206"
          y1="5.633605"
          x2="8.1418142"
          y2="6.4757628"
          style="fill:none;fill-opacity:0.512821;stroke:#ffffff;stroke-opacity:0.4778555;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round"
        />
        <line
          x1="17.315939"
          y1="4.1846051"
          x2="17.172018"
          y2="4.3279939"
          style="fill:none;fill-opacity:0.512821;stroke:#ffffff;stroke-opacity:0.4778555;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round"
        />
        <line
          x1="15.866209"
          y1="5.633605"
          x2="15.024317"
          y2="6.4757628"
          style="fill:none;fill-opacity:0.512821;stroke:#ffffff;stroke-opacity:0.4778555;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round"
        />
        <path
          d="m 10.006,11.2556 c 1.9778,1.9778 1.6349,3.4541 1.3708,6.0349 C 8.79554,17.5551 7.31889,17.8982 5.3414,15.9207 3.36338,13.9432 2.50877,11.2686 2.77388,8.6876 5.3541,8.4232 8.02877,9.2778 10.006,11.2556 Z"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:#18aa67;fill-opacity:1"
        />
        <path
          d="m 2.77388,8.6876 8.60292,8.6029 C 8.79554,17.5551 7.31889,17.8982 5.3414,15.9207 3.36364,13.9432 2.50877,11.2686 2.77388,8.6876 Z"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:#066782;fill-opacity:1"
        />
        <path
          d="m 10.006,11.2556 c 1.9778,1.9778 1.6349,3.4541 1.3708,6.0349 C 8.79554,17.5551 7.31889,17.8982 5.3414,15.9207 3.36338,13.9432 2.50877,11.2686 2.77388,8.6876 5.3541,8.4232 8.02877,9.2778 10.006,11.2556 Z"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <line
          x1="2.9863553"
          y1="8.9333172"
          x2="11.556864"
          y2="17.503822"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <line
          x1="4.5897832"
          y1="14.848601"
          x2="8.7325659"
          y2="14.848601"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <line
          x1="6.9345732"
          y1="9.5036716"
          x2="6.9345732"
          y2="12.707826"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <path
          d="m 13.1784,11.2556 c -1.9778,1.9778 -1.6349,3.4541 -1.3708,6.0349 2.5813,0.2646 4.0579,0.6077 6.0357,-1.3698 1.9777,-1.9775 2.8323,-4.6521 2.5672,-7.2331 -2.5802,-0.2644 -5.2549,0.5902 -7.2321,2.568 z"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:#18aa67;fill-opacity:1"
        />
        <path
          d="m 20.4105,8.6876 -8.6029,8.6029 c 2.5813,0.2646 4.0579,0.6077 6.0357,-1.3698 1.9775,-1.9775 2.8323,-4.6521 2.5672,-7.2331 z"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:#066782;fill-opacity:1"
        />
        <path
          d="m 13.1784,11.2556 c -1.9778,1.9778 -1.6349,3.4541 -1.3708,6.0349 2.5813,0.2646 4.0579,0.6077 6.0357,-1.3698 1.9777,-1.9775 2.8323,-4.6521 2.5672,-7.2331 -2.5802,-0.2644 -5.2549,0.5902 -7.2321,2.568 z"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none;fill-opacity:1"
        />
        <line
          x1="20.274151"
          y1="8.854887"
          x2="11.703643"
          y2="17.425392"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:#18aa67;fill-opacity:1"
        />
        <line
          x1="18.325636"
          y1="15.178003"
          x2="14.182854"
          y2="15.178003"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <line
          x1="16.483061"
          y1="9.4095564"
          x2="16.483061"
          y2="12.613711"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
        <line
          x1="11.598884"
          y1="17.670092"
          x2="11.598884"
          y2="26.653643"
          style="stroke:#33363a;stroke-opacity:1;stroke-width:0.79375;stroke-miterlimit:4;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;fill:none"
        />
      </g>
    </g>
  </g>
</svg>

<style lang="sass">

</style>
