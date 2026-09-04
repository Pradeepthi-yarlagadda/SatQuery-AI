# 🛰️ Remote-Sensing Domain Adaptation

Generic web Vision-Language Models fail on earth observation data due to:
1. **Nadir Viewing Geometry**: No vertical horizon, objects are observed strictly from above.
2. **Multi-Spectral Bands**: Non-RGB infrared, water vapor, and red-edge channels.
3. **Microwave Radar Physics**: SAR backscatter involves dielectric constants, double-bounce scattering, and speckle noise.

Orbit-IQ fine-tunes projection layers using:
- **BigEarthNet.txt**: [https://huggingface.co/datasets/BIFOLD-BigEarthNetv2-0/BigEarthNet.txt](https://huggingface.co/datasets/BIFOLD-BigEarthNetv2-0/BigEarthNet.txt)
- **VRSBench**: [https://huggingface.co/datasets/xiang709/VRSBench](https://huggingface.co/datasets/xiang709/VRSBench)
- **Adaptive Lee Speckle Filtering**: Window size = 5 for C-band SAR backscatter.
