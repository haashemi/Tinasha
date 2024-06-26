![Banner](https://github.com/haashemi/Tinasha/assets/60406325/b11beb5a-2335-4611-87cc-3814db0cd8e0)

# Tinasha

Tinsha is another MyAnimeList client build with React Native for Android for my own experiments and learnings. It's aimed to be a simpler version of current MyAnimeList client with better UI/UX.

## Build steps:

To build Tinasha, after updating the `.env` file with your MAL CLIENT_ID from [here](https://myanimelist.net/apiconfig), you should follow the [EAS Build](https://docs.expo.dev/build/setup/#run-a-build) steps.

```bash
# 1. Install dependencies
yarn install

# 2. Build with eas build
# Additionally, you can add --local to build it locally.
eas build --platform android --profile preview
```
