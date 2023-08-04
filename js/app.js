(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function rippleEffect() {
        document.addEventListener("click", (function(e) {
            const targetItem = e.target;
            if (targetItem.closest("[data-ripple]")) {
                const button = targetItem.closest("[data-ripple]");
                const ripple = document.createElement("span");
                const diameter = Math.max(button.clientWidth, button.clientHeight);
                const radius = diameter / 2;
                ripple.style.width = ripple.style.height = `${diameter}px`;
                ripple.style.left = `${e.pageX - (button.getBoundingClientRect().left + scrollX) - radius}px`;
                ripple.style.top = `${e.pageY - (button.getBoundingClientRect().top + scrollY) - radius}px`;
                ripple.classList.add("ripple");
                button.dataset.ripple === "once" && button.querySelector(".ripple") ? button.querySelector(".ripple").remove() : null;
                button.appendChild(ripple);
                const timeOut = getAnimationDuration(ripple);
                setTimeout((() => {
                    ripple ? ripple.remove() : null;
                }), timeOut);
                function getAnimationDuration() {
                    const aDuration = window.getComputedStyle(ripple).animationDuration;
                    return aDuration.includes("ms") ? aDuration.replace("ms", "") : aDuration.replace("s", "") * 1e3;
                }
            }
        }));
    }
    function colorPage() {
        window.addEventListener("load", windowLoad);
        function windowLoad() {
            const htmlBlock = document.documentElement;
            const saveUserTheme = localStorage.getItem("user-theme");
            let userTheme;
            if (window.matchMedia) userTheme = window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
            window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", (e => {
                !saveUserTheme ? changeTheme() : null;
            }));
            const themeButton = document.querySelector(".theme__page");
            const resetButton = document.querySelector(".theme__reset");
            if (themeButton) themeButton.addEventListener("click", (function(e) {
                resetButton.classList.add("active");
                changeTheme(true);
            }));
            if (resetButton) resetButton.addEventListener("click", (function(e) {
                resetButton.classList.remove("active");
                localStorage.setItem("user-theme", "");
            }));
            function setThemeClass() {
                if (saveUserTheme) {
                    htmlBlock.classList.add(saveUserTheme);
                    resetButton.classList.add("active");
                } else htmlBlock.classList.add(userTheme);
            }
            setThemeClass();
            function changeTheme(saveTheme = false) {
                let currentTheme = htmlBlock.classList.contains("light") ? "light" : "dark";
                let newTheme;
                if (currentTheme === "light") newTheme = "dark"; else if (currentTheme === "dark") newTheme = "light";
                htmlBlock.classList.remove(currentTheme);
                htmlBlock.classList.add(newTheme);
                saveTheme ? localStorage.setItem("user-theme", newTheme) : null;
            }
        }
    }
    function weather() {
        const weatherBlock = document.querySelector("#weather");
        async function loadWeather(e) {
            weatherBlock.innerHTML = `\n\t\t\t<div class="weather__loading">\n\t\t\t\t<img src="@img/loading.gif" alt="Loading...">\n\t\t\t</div>`;
            const server = "https://api.openweathermap.org/data/2.3/onecall?lat=56.60&lon=57.77&exclude=Krasnoufimsk&appid=81cc1a3664b19d3a5e5e8811d5fd7e0f";
            const response = await fetch(server, {
                method: "GET"
            });
            const responseResult = await response.json();
            if (response.ok) getWeather(responseResult); else weatherBlock.innerHTML = responseResult.message;
        }
        function getWeather(data) {
            console.log(data);
            const location = data.name;
            const temp = Math.round(data.main.temp);
            const feelsLike = Math.round(data.main.feels_like);
            const weatherStatus = data.weather[0].main;
            const weatherIcon = data.weather[0].icon;
            const template = `\n\t\t\t \t<div class="weather__header">\n\t\t \t<div class="weather__main">\n\t\t \t\t<div class="weather__city">${location}</div>\n\t\t \t\t<div class="weather__status">${weatherStatus}</div>\n\t\t \t</div>\n\t\t \t<div class="weather__icon">\n\t\t \t\t<img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="${weatherStatus}">\n\t\t \t</div>\n\t\t </div>\n\t\t <div class="weather__temp">${temp}</div>\n\t\t\t <div class="weather__feels-like">Feels like: ${feelsLike}</div>`;
            weatherBlock.innerHTML = template;
        }
        if (weatherBlock) loadWeather();
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window["FLS"] = true;
    isWebp();
    rippleEffect();
    colorPage();
    weather();
})();