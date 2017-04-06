// Mostly provides a way to stub window object actions.

const util = {
  redirect(url) {
    window.location = url;
  }
};

export default util;
