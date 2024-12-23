# Your Spotify Scrubber

Spotify’s Extended Listening History currently exports a new format. This small script rewrites it into a format compatible with the **Account Data** import feature in your Spotify-related tool of choice. Although this format change has been officially addressed in the nightly version, this script can serve as a workaround—especially if you’re using the `linux-server` container or Unraid.

## Usage Guide

1. **Download/Clone this Repository**  
   Make sure you have Node.js installed on your system.

2. **Initial Run**  
   In a terminal or command prompt, navigate to the repository folder and run:
   ```bash
   node scrub.js
   ```
   This will create two folders: `inputs` and `outputs`.

3. **Place Your Spotify Files**  
   - Request your “Spotify Extended Streaming History” [here](https://www.spotify.com/us/account/privacy/) and unzip the contents.  
   - Locate the files named something like `Streaming_History_Audio_YYYY-YYYY_X.json` in the unzipped folder.  
   - Copy these files into the `inputs` folder **(omit any files named `Streaming_History_Video_...`)**.

4. **Convert the Files**  
   Run the script again:
   ```bash
   node scrub.js
   ```
   All valid JSON files in the `inputs` folder will be converted and saved to the `outputs` folder in the desired format.

5. **Import the Scrubbed Files**  
   Open your Spotify-related application and go to **Settings > Import > Account Data** (or whichever menu your tool uses to import). Select the JSON files from the `outputs` folder.

---

This script is a quick workaround, but it should handle most use cases. Thanks for checking it out! If you find any issues or have suggestions, feel free to open an issue or submit a pull request.
