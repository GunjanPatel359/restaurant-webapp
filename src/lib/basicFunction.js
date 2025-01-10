

function compareIsoDateWithUnixTime(isoDateString, unixTimestamp) {
    const isoDate = new Date(isoDateString);
    const unixDate = new Date(unixTimestamp);

    if (isoDate.getTime() <= unixDate.getTime()) {
      return true
    } else {
      return false
    }
  }
  
export {
  compareIsoDateWithUnixTime
}