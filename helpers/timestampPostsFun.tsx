function timestampPostsFun(timestampSeconds: number): string {
    let time: string;

    const year = new Date(timestampSeconds * 1000).getFullYear();
    const month = new Date(timestampSeconds * 1000).getMonth();
    const date = new Date(timestampSeconds * 1000).getDate();

    const hours = new Date(timestampSeconds * 1000).getHours();
    const minutes = new Date(timestampSeconds * 1000).getMinutes();
    const seconds = new Date(timestampSeconds * 1000).getSeconds();
    const millseconds = new Date(timestampSeconds * 1000).getMilliseconds();

    const modifiedDate = new Date(
        year,
        month,
        date,
        hours,
        minutes,
        seconds,
        millseconds
    );

    const currentDate = new Date();

    const different = currentDate.getTime() - modifiedDate.getTime();

    const timeInSeconds = +(different / 1000).toFixed(0);
    const timeInMinutes = +(different / (1000 * 60)).toFixed(0);
    const timeInHours = +(different / (1000 * 60 * 60)).toFixed(0);
    const timeInDays = +(different / (1000 * 60 * 60 * 24)).toFixed(0);
    const timeInWeek = +(different / (1000 * 60 * 60 * 24 * 7)).toFixed(0);

    if (timeInSeconds < 59) {
        time = `A FEW SECONDS AGO`;
        return time;
    } else if (timeInMinutes < 3) {
        time = `A FEW MINUTES AGO`;
        return time;
    } else if (timeInMinutes <= 59) {
        time = `${timeInMinutes} MINUTES AGO`;
        return time;
    } else if (timeInHours <= 23) {
        time = `${timeInHours} ${timeInHours < 2 ? "HOUR" : "HOURS"} AGO`;
        return time;
    } else if (timeInDays <= 6) {
        time = `${timeInDays} ${timeInDays < 2 ? "DAY" : "DAYS"} AGO`;
        return time;
    } else {
        time = `${timeInWeek} ${timeInWeek < 2 ? "WEEK" : "WEEKS"} AGO`;
        return time;
    }
}

export default timestampPostsFun;
