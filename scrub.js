const fs = require('fs');
const path = require('path');

const inputFolder = './inputs';
const outputFolder = './outputs';

// Create output folder if it doesn't exist
if (!fs.existsSync(outputFolder) || !fs.existsSync(inputFolder)) {
    fs.mkdirSync(outputFolder);
    fs.mkdirSync(inputFolder);
}

// Function to convert Spotify timestamps to "YYYY-MM-DD HH:mm"
const convertTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// Function to filter out entries with any null values
const filterNullEntries = (data) => {
    return data.filter(entry =>
        Object.values(entry).every(value => value !== null)
    );
};

// Read all JSON files in the input folder
fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error('Error reading input folder:', err);
        return;
    }

    // Only process .json files
    const jsonFiles = files.filter(file => path.extname(file) === '.json');

    jsonFiles.forEach((file, index) => {
        const inputFilePath = path.join(inputFolder, file);

        // You can adjust the naming convention here if needed
        const outputFilePath = path.join(
            outputFolder,
            `StreamingHistory_FIXED_${index}.json` 
        );

        try {
            // Parse JSON content
            const data = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));

            // 1) Transform (rename, remove, reorder) each entry
            data.forEach(entry => {
                // Remove these unused keys
                [
                    'platform',
                    'conn_country',
                    'ip_addr',
                    'master_metadata_album_album_name',
                    'spotify_track_uri',
                    'episode_name',
                    'episode_show_name',
                    'spotify_episode_uri',
                    'reason_start',
                    'reason_end',
                    'shuffle',
                    'skipped',
                    'offline',
                    'offline_timestamp',
                    'incognito_mode'
                ].forEach(key => delete entry[key]);

                // Convert ts → endTime
                if (entry.ts) {
                    entry.endTime = convertTimestamp(entry.ts);
                    delete entry.ts;
                }

                // Rename artistName
                if (entry.master_metadata_album_artist_name !== undefined) {
                    entry.artistName = entry.master_metadata_album_artist_name;
                    delete entry.master_metadata_album_artist_name;
                }

                // Rename trackName
                if (entry.master_metadata_track_name !== undefined) {
                    entry.trackName = entry.master_metadata_track_name;
                    delete entry.master_metadata_track_name;
                }

                // Rename msPlayed
                if (entry.ms_played !== undefined) {
                    entry.msPlayed = entry.ms_played;
                    delete entry.ms_played;
                }
            });

            // Reorder keys in the desired sequence
            const keyOrder = ["endTime", "artistName", "trackName", "msPlayed"];
            const reorderedData = data.map(entry => {
                const reorderedEntry = {};
                keyOrder.forEach(key => {
                    if (key in entry) {
                        reorderedEntry[key] = entry[key];
                    }
                });
                return reorderedEntry;
            });

            // 2) Filter out any entries containing null values
            const filteredData = filterNullEntries(reorderedData);

            // Write the final cleaned data to a new JSON file
            fs.writeFileSync(outputFilePath, JSON.stringify(filteredData, null, 2));
            console.log(`Processed: ${file} -> ${outputFilePath}`);
        } catch (error) {
            console.error(`Error processing file ${file}:`, error);
        }
    });
});
