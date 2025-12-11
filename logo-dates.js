document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo-img");

  // ✅ Image par défaut
  const defaultLogo = "icons/logo.png";

  // 📅 Liste des logos spéciaux par dates
  const specialLogos = [
  {
    name: "Noel",
    start: "12-20",
    end: "12-31",
    image: "icons/christmas.png"
  },
  {
    name: "Halloween",
    start: "10-25",
    end: "10-31",
    image: "icons/halloween.png"
  },
  {
    name: "Newyear",
    start: "12-31",
    end: "1-1",
    image: "icons/newyear.png"
  }
];

const today = new Date();
const currentMonth = today.getMonth() + 1;
const currentDay = today.getDate();
const currentKey = `${currentMonth.toString().padStart(2,'0')}-${currentDay.toString().padStart(2,'0')}`;

function isBetween(date, start, end) {
  return date >= start && date <= end;
}

const activeLogo = specialLogos.find(event =>
  isBetween(currentKey, event.start, event.end)
);

logo.src = activeLogo ? activeLogo.image : defaultLogo;

});
