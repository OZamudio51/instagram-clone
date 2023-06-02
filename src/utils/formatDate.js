import { format, isThisYear, formatDistanceStrict, formatDistanceToNow } from "date-fns";

export const formatPostDate = date => {
    const formatShort = format(new Date(date), "MMMM d").toUpperCase();

    const formatLong = format(new Date(date), "MMMM d, yyyy").toUpperCase();

    return isThisYear(new Date(date)) ? formatShort : formatLong;
}

export const formatDateToNowShort = date => formatDistanceStrict(new Date(date), new Date(Date.now())).split(" ").map((str, i) => i === 1 ? str[0] : str).join("");

export const formatDateToNow = date => formatDistanceToNow(new Date(date), { addSuffix: true }).toUpperCase();