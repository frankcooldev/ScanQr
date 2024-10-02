# QR Code Generator and Scanner Web Application

A web application that allows users to generate unique QR codes and scan them using their device's webcam. The application tracks whether a QR code has already been scanned, providing real-time feedback.

## Features

- **QR Code Generation**: Generate QR codes with unique identifiers embedded in a URL.
- **Continuous Scanning**: Automatically scans for QR codes using the webcam without manual activation.
- **Duplicate Detection**: Checks if a QR code has already been scanned and notifies the user.
- **Real-time Feedback**: Provides immediate visual feedback upon scanning a QR code.
- **Cross-platform**: Works on modern web browsers with webcam support.

## Demo

![Demo Screenshot](demo_screenshot.png)

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6)
  - [Bootstrap 5](https://getbootstrap.com/)
  - [WebcamJS](https://github.com/jhuckaby/webcamjs) for webcam integration
  - [jsQR](https://github.com/cozmo/jsQR) for QR code decoding
  - [Axios](https://axios-http.com/) for AJAX requests
- **Backend**:
  - PHP
- **Libraries**:
  - [QRCode.js](https://github.com/davidshimjs/qrcodejs) for QR code generation

## Getting Started

### Prerequisites

- A web server with PHP support (e.g., Apache, Nginx)
- HTTPS configuration (required for webcam access in most browsers)
- A modern web browser (Chrome, Firefox, Edge)
