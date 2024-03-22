import { addClass, removeClass } from "./removeMargin";

//functions for common drawer
export function closeDrawer() {
  addClass("drawer", "hide-drawer");
  // removeClass("main-section", "bg-opacity");
  addClass("overlay", "tab");
  const overlay = document.getElementById("overlay");

  if (typeof window !== "undefined" && window.innerWidth < 1200) {
    var body = document.getElementsByTagName("BODY")[0];
    body.classList.remove("hide");
  }
}

export function openDrawer(close = null) {
  // removeClass("overlay", "tab");
  // if (typeof window !== "undefined" && window.innerWidth < 1200) {
  //   //adds overlay
  //   const overlay = document.getElementById("overlay");
  //   //adds click event listner on overlay
  //   overlay.addEventListener("click", () => {
  //     closeDrawer();
  //     close && close();
  //   });
  // }
  // removeClass("drawer", "hide-drawer");
}

export function defaultClosed() {
  addClass("drawer", "drawer");
  addClass("drawer", "hide-drawer");
  // addClass("overlay", "tab");
  // addClass("overlay", "tab");
}

//functions for connection drawer
export function closeConnectionDrawer() {
  addClass("connection-drawer", "hide-drawer");
  // removeClass("main-section", "bg-opacity");
  addClass("overlay", "tab");

  if (typeof window !== "undefined" && window.innerWidth < 1200) {
    var body = document.getElementsByTagName("BODY")[0];
    body.classList.remove("hide");
  }
}

export function openConnectionDrawer() {
  if (typeof window !== "undefined" && window.innerWidth < 1200) {
    //adds overlay
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("tab");

    //adds click event listner on overlay
    overlay.addEventListener("click", () => {
      closeDrawer();
    });
  }

  removeClass("connection-drawer", "hide-drawer");
}

export function defaultConnectionClosed() {
  addClass("connection-drawer", "drawer");
  addClass("connection-drawer", "hide-drawer");
}

export const useOpenDrawer = (close = null) => {
  function openDrawerWithClose() {
    openDrawer(close);
  }
  return openDrawerWithClose;
};
