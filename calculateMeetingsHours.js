const moment = require("moment");
const csvtojson = require("csvtojson");

// File path to your CSV file, replace mine with yours
const csvFilePath = "calendar_export.csv";

async function processCSV() {
  try {
    // Meetings names to exclude from the calculation
    const excludedSubjects = [
      "Drinks",
      "Valtech Office day!",
      "Geannuleerd: Refinement",
    ];

    // Convert CSV to JSON
    const jsonArrayObj = await csvtojson().fromFile(csvFilePath);

    // console.log("Converted JSON data:", jsonArrayObj);

    // Access and use the JSON data
    const meetingDurations = jsonArrayObj
      .filter((meeting) => {
        return !excludedSubjects.includes(meeting.Subject);
      })
      .map((meeting) => {
        const startTime = moment(meeting["Start Time"], "HH:mm:ss");
        const endTime = moment(meeting["End Time"], "HH:mm:ss");

        if (startTime.isValid() && endTime.isValid()) {
          const duration = moment.duration(endTime.diff(startTime));
          return duration.asHours(); // Get duration in hours
        }

        // If start or end time is missing or invalid, return 0
        return 0;
      });

    // Calculate total meeting duration
    const totalMeetingDuration = meetingDurations.reduce(
      (sum, duration) => sum + duration,
      0
    );

    console.log(
      `Total meetings duration: ${totalMeetingDuration.toFixed(2)} hours`
    );

    // Your further code logic here using jsonArrayObj
  } catch (err) {
    console.error("Error during CSV to JSON conversion:", err);
  }
}

// Call the async function
processCSV();
