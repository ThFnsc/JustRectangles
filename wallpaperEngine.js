if (window.wallpaperRegisterAudioListener)
    window.wallpaperRegisterAudioListener(audioListener);

function loadWallpaperEngine() {
    window.wallpaperPropertyListener = {
        applyGeneralProperties: function (properties) {
            if (properties.fps)
                frameRate(properties.fps);
        },
        applyUserProperties: function (properties) {
            colorFromProperty(properties.background_color, "backgroundColor");
            valueFromProperty(properties.rectangle_count, "density").then(applyProperties);
            valueFromProperty(properties.leave_traces, "leaveTraces").then(applyProperties);
            valueFromProperty(properties.maximum_alpha, "maxAlpha").then(applyColors);
            valueFromProperty(properties.minimum_alpha, "minAlpha").then(applyColors);
            valueFromProperty(properties.minimum_hue, "minHue").then(applyColors);
            valueFromProperty(properties.maximum_hue, "maxHue").then(applyColors);
            valueFromProperty(properties.minimum_speed, "minSpeed").then(applyProperties);
            valueFromProperty(properties.maximum_speed, "maxSpeed").then(applyProperties);
            valueFromProperty(properties.minimum_width, "minSize").then(applyProperties);
            valueFromProperty(properties.maximum_width, "maxSize").then(applyProperties);
            valueFromProperty(properties.volume_multiplier, "volumeMultiplier");
            valueFromProperty(properties.saturation, "saturation", applyColors);
            valueFromProperty(properties.brightness, "brightness", applyColors);
        }
    }
}

function audioListener(samples) {
    for (var i = 0; i < shapes.length; i++)
        shapes[i].recalculateColor(Math.round(samples[Math.floor((i / shapes.length) * samples.length)] * prop.volumeMultiplier));
}

function valueFromProperty(property, propIndex) {
    return new Promise((resolve, err) => {
        if (property && property.value != undefined) {
            prop[propIndex] = property.value;
            resolve(prop[propIndex]);
        } else err(property);
    });
}

function colorFromProperty(property, colorTo, callback) {
    return new Promise((resolve, err) => {
        if (property && property.value != undefined) {
            var channels = property.value.split(" ").map(channel => { return Math.ceil(channel * 255); });
            prop[colorTo] = color(channels[0], channels[1], channels[2]);
            resolve(prop[colorTo]);
        } else err();
    });
}