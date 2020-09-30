export default function FormatDate(input) {
    const datePart = input.match(/\d+/g),
        year = datePart[0].substring(0),
        month = datePart[1],
        day = datePart[2];
    return day + '/' + month + '/' + year;
}
