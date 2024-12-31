'use client'
import React from 'react';

const LoadingModal = () => {
  return (
    <div className="loading-modal flex items-center justify-center mb-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="41"
        height="71"
        viewBox="0 0 41 71"
        fill="none"
      >
        <path
          d="M32.333 47.1046C31.0664 47.5979 29.7721 47.929 28.4629 48.1511C28.3689 51.0366 28.4031 53.9498 28.9456 56.7775C29.5906 60.1436 30.6671 63.5074 31.6816 66.7752C32.6854 70.0066 28.7299 71.5508 26.5129 69.7824C20.3832 64.8957 19.7061 56.0343 19.8791 48.7342C19.8812 48.6573 19.8898 48.5783 19.8898 48.5014C18.9629 48.4693 18.0359 48.433 17.1154 48.4031C16.2205 48.3754 15.3234 48.3561 14.4243 48.3455C13.6191 54.4453 13.0958 60.5985 12.5085 66.7325C12.2821 69.0818 8.88401 69.8272 8.21336 67.3134C6.6286 61.3503 5.93019 55.1309 6.18222 48.9648C4.81744 49.2339 3.46761 49.6013 2.14555 50.1267C0.340799 50.8443 -0.902239 47.8136 0.829897 47.0085C2.66669 46.1541 4.54619 45.5753 6.45987 45.1866C7.11129 39.0526 8.7345 33.0361 11.4384 27.4532C12.0535 26.1824 14.1124 27.0922 13.6917 28.4036C11.9895 33.7239 10.866 39.1637 10.4218 44.6377C10.5264 44.6292 10.629 44.6249 10.7336 44.6185C10.881 43.7492 11.007 42.8757 11.1693 42.0064C12.5213 34.7747 14.2022 27.5194 17.141 20.7468C18.2474 18.2009 20.3084 15.7512 23.4609 16.0203C27.0234 16.3236 28.5419 18.6238 29.0502 22.5323C29.5586 26.4494 29.266 30.5864 29.1891 34.5226C29.125 37.7712 28.8431 41.0176 28.6444 44.264C29.7337 44.1914 30.8208 44.1102 31.908 43.9863C33.8409 43.7663 33.8451 46.5172 32.333 47.1046ZM20.0799 44.4904C20.4173 38.9224 21.1051 33.3586 21.891 27.8526C22.0662 26.6202 22.2669 25.3921 22.4933 24.1683C22.5873 23.6557 23.5249 19.8071 22.284 20.2299C21.1627 20.6187 20.6096 22.81 20.2272 23.8095C19.6762 25.2405 19.2191 26.7057 18.7429 28.1623C16.9979 33.5039 15.851 38.9587 14.9945 44.4626C15.3533 44.4626 15.71 44.4583 16.071 44.4605C17.408 44.4733 18.745 44.4861 20.0799 44.4904Z"
          fill="#0B0112"
        />
        <path
          className="loading-animation"
          d="M33.7797 7.83597C33.5811 7.78043 33.3782 7.72704 33.1689 7.67578C30.5739 8.3272 27.1203 8.72018 23.3036 8.72018H23.09C19.3588 8.70523 15.9842 8.31011 13.4426 7.67578L12.8296 7.8381C9.80749 8.94444 9.84379 9.58303 12.8339 10.5335C15.4332 11.266 19.0534 11.7252 23.0922 11.7402L23.3057 11.7423C27.4278 11.7423 31.1292 11.2789 33.7776 10.5335C36.2402 9.74108 36.1782 8.69242 33.7797 7.83597Z"
          fill="#0B0112"
        />
        <path
          className="loading-animation delay"
          d="M34.758 1.34768C31.7978 0.51686 27.7441 0 23.308 0H23.0944C18.7417 0.0170863 14.7712 0.529675 11.8601 1.34768C8.23997 2.36859 5.99951 4.05586 5.99951 6.16816C5.99951 6.69783 6.14261 7.20402 6.41172 7.67816C7.21478 6.26641 9.15195 5.13016 11.8601 4.36555C14.7712 3.54755 18.7417 3.03496 23.0944 3.01787H23.308C27.7441 3.01787 31.7978 3.53473 34.758 4.36555C37.4662 5.13016 39.4034 6.26641 40.2065 7.67816C40.4756 7.20188 40.6187 6.69783 40.6187 6.16816C40.6165 4.05586 38.3782 2.36859 34.758 1.34768Z"
          fill="#0B0112"
        />
      </svg>
    </div>
  );
};

export default LoadingModal;
