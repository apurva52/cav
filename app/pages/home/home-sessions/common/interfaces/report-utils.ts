export default class ReportUtils {


    // to convert 24 hour format time to am/pm
    static timeTo12HrFormat(time): string {
        const time_part_array = time.split(':');
        let ampm = 'AM';

        if (time_part_array[0] >= 12) {
            ampm = 'PM';
        }

        if (time_part_array[0] > 12) {
            time_part_array[0] = time_part_array[0]; // Removing -12 as Exact time need to be sent
        }

        const formatted_time =
            time_part_array[0] + ':' + time_part_array[1] + ' ' + ampm;

        return formatted_time;
    }

    static convertDateTimeInMillis(format, timeFilter, serverOffset) {
        let currentTime = new Date();
        const startEndTime = new Array();
        const time = format.split('_');
        currentTime = new Date(
            currentTime.getTime() +
            currentTime.getTimezoneOffset() * 60000 +
            serverOffset
        );

        if (timeFilter === 'custom') {
            for (let j = 0; j < 2; j++) {
                const d = new Date(time[j]);
                const n = d.getTime();
                startEndTime[j] = n;
            }
        } else if (timeFilter === 'last') {
            if (time[1] === 'hours') {
                startEndTime[1] = currentTime.getTime();
                startEndTime[0] = startEndTime[1] - time[0] * 60 * 60 * 1000;
            } else if (time[1] === 'days') {
                startEndTime[1] = currentTime.getTime();
                const lastDay =
                    currentTime.getHours() * 3600 +
                    currentTime.getMinutes() * 60 +
                    currentTime.getSeconds();
                // handling for the last day.
                const lastTime =
                    lastDay + (parseInt(time[0], 10) === 1 ? 1 : time[0] - 1) * 24 * 60 * 60 * 1000;
                startEndTime[0] = startEndTime[1] - lastTime;
            } else if (time[1] === 'weeks') {
                startEndTime[1] = currentTime.getTime();
                startEndTime[0] = startEndTime[1] - time[0] * 7 * 24 * 60 * 60 * 1000;
            } else if (time[1] === 'months') {
                startEndTime[1] = currentTime.getTime();
                startEndTime[0] = startEndTime[1] - time[0] * 30 * 24 * 60 * 60 * 1000;
            } else {
                startEndTime[1] = currentTime.getTime();
                startEndTime[0] = startEndTime[1] - time[0] * 365 * 24 * 60 * 60 * 1000;
            }
            return startEndTime;
        }
        return startEndTime;
    }
}

