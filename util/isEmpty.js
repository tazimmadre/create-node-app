export default function isEmpty(data) {
    if(typeof data === 'undefined' || data === null || data === '' || data.length <= 0){
      return true;
    }else {
      return false;
    }
  }
