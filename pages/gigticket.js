const promoter = document.getElementById('promoter');
const bandName = document.getElementById('band-name');
const bandOther = document.getElementById('band-other');
const venue = document.getElementById('venue');
const address = document.getElementById('venue-address');
const gigDateTime = document.getElementById('gig-date-time');
const price = document.getElementById('price');
const typeSelect = document.getElementById('type-select');
const sizeSlider = document.getElementById('size');
const fadeSlider = document.getElementById('fade');
const colorPicker = document.getElementById('color-picker');
const colorBox = document.getElementById('chosen-color');
const gigSelect = document.getElementById('gig-select');
const downloadButton = document.getElementById('download-button');
const divToCapture = document.getElementById('full-ticket');
var currentElement;
var relatedElement;
var currentTemplate = 1;
var dateWarningShown = false;
var storeOnComplete = false;
var clearOnComplete = true;

// Limit support/other info font size to be smaller than main band name
const ticketBandNames = document.querySelectorAll('p[id*="ticket-band-"]');

function resizeComponents() {
    const ticketBandName = document.getElementById('ticket-band-name-' + currentTemplate);
    const ticketOtherName = document.getElementById('ticket-band-other-' + currentTemplate);
    
    if (ticketBandName.style.fontSize <= ticketOtherName.style.fontSize) {
        fitText(ticketOtherName, getFontSizeVal(ticketBandName)-2);
    }
}

const resizeObserver = new ResizeObserver(resizeComponents);

ticketBandNames.forEach(el => {
    resizeObserver.observe(el);
});

document.addEventListener('DOMContentLoaded', function() {
    const defaultFonts = [0, 1, 2, 3, 4, 6, 7, 8, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    const randomFontIndex = Math.floor(Math.random() * defaultFonts.length);
    const randomFont = 'font' + defaultFonts[randomFontIndex];

    const ticketBandNames = document.querySelectorAll('p[id*="ticket-band-"]');
    ticketBandNames.forEach(el => {
        el.style.fontFamily = window.getComputedStyle(document.getElementById(randomFont)).fontFamily;
    });
    
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    // Toggle dropdown menu on button click
    dropdownButton.addEventListener('click', function() {
      dropdownMenu.classList.toggle('show');
    });

    // Handle item selection
    dropdownItems.forEach(item => {
      item.addEventListener('click', function() {
        dropdownButton.style.fontFamily = window.getComputedStyle(document.getElementById(this.id)).fontFamily;
        requestAnimationFrame(() => setFontAndResize(this.id));
        dropdownMenu.classList.remove('show');
      });
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function(event) {
      if (!event.target.matches('.dropdown-toggle')) {
        if (dropdownMenu.classList.contains('show')) {
          dropdownMenu.classList.remove('show');
        }
      }
    });
    
    let fac51Margin = Math.ceil(window.innerWidth / 52);
    document.getElementById('ticket-price-6').style.marginTop = fac51Margin + 'px';
    document.getElementById('ticket-band-name-6').style.marginTop = fac51Margin + 'px';
});


gigSelect.addEventListener('change', function() {
  setPresets(this.value);
});

// Listen for the 'input' event
colorPicker.addEventListener('input', function() {
  // Get the current color value from the picker
  const selectedColor = colorPicker.value;
  currentElement.style.color = selectedColor;
  if (relatedElement !== null) {
      relatedElement.style.color = selectedColor;
  }
  setOverrideData(document.getElementById('apply-colour'), colorPicker.value);
});

promoter.addEventListener('input', function() {
    let element = document.getElementById('ticket-promoter-' + currentTemplate);
    if (element !== null) {
        element.innerHTML = promoter.value;
        fitText(element, 22); 
    }
});
bandName.addEventListener('input', function() {
    let element = document.getElementById('ticket-band-name-' + currentTemplate);
    if (element !== null) {
        element.innerHTML = bandName.value;
        fitText(element, 64); 
    }
});
bandOther.addEventListener('input', function() {
    let element = document.getElementById('ticket-band-other-' + currentTemplate);
    if (element !== null) {
        element.innerHTML = bandOther.value;
        fitText(element, 48); 
    }
});
venue.addEventListener('input', function() {
    let element = document.getElementById('ticket-venue-' + currentTemplate);
    if (element !== null) {
        if (currentTemplate !== 4) {
            element.innerHTML = venue.value;
            fitText(element, 36); 
        } else {
            let venueVal = venue.value;
            element.innerHTML = venueVal.split('').map(char => char.toUpperCase()).join(' ').replaceAll(' ', '&nbsp;');
            fitText(element, 28); 
        }
    }
});
address.addEventListener('input', function() {
    let element = document.getElementById('ticket-address-' + currentTemplate);
    if (element !== null) {
        element.innerHTML = address.value;
        fitText(element, 32); 
    }
});
price.addEventListener('input', function() {
    let element = document.getElementById('ticket-price-' + currentTemplate);
    if (element !== null) {
        element.innerHTML = price.value;
        fitText(element, 28); 
    }
});
gigDateTime.addEventListener('input', function() {
    let element = document.getElementById('ticket-date-time-' + currentTemplate);
    let dateTimeValue = document.querySelector('[name="gig-date-time"]').value
    formatDateTime(dateTimeValue);
    fitText(element, 20); 
    requestAnimationFrame(() => document.getElementById('ticket-doors-' + currentTemplate).style.fontSize = element.style.fontSize);
    
    const selectedDate = new Date(dateTimeValue);
    const now = new Date();
    if (selectedDate > now) {
        document.getElementById('not-ticket').style.display = 'inline';
        if (!dateWarningShown) {
            document.getElementById('date-warning').style.display = 'block';
            dateWarningShown = true;
        }
    } else {
        document.getElementById('not-ticket').style.display = 'none';        
    }
});
typeSelect.addEventListener('change', function() {
  let typeValue = this.value;
  if (this.value === 'none') {
      typeValue = '';
  } else if (typeValue.includes('SEATING')) {
      if (typeValue.includes('VIP')) {
          typeValue += ' - Row ' + getRandomLetter(0, 3) + ', Seat ' + getRandomNumber(50);
      } else {
          typeValue += ' - Row ' + getRandomLetter(3, 25) + ', Seat ' + getRandomNumber(250);                  
      }
  }
  
  const element = document.getElementById('ticket-type-' + currentTemplate);
  element.innerHTML = typeValue;
  fitText(element, 24);
});

sizeSlider.addEventListener('input', function() {
    fitText(currentElement, sizeSlider.value);
    if (relatedElement !== null) {
        requestAnimationFrame(() => relatedElement.style.fontSize = currentElement.style.fontSize);
    }    
});

fadeSlider.addEventListener('input', function() {
    currentElement.style.opacity = fadeSlider.value/100.0;
    if (relatedElement !== null) {
        requestAnimationFrame(() => relatedElement.style.opacity = currentElement.style.opacity);
    }
});

downloadButton.addEventListener('click', function () {
    html2canvas(divToCapture, {
        useCORS: true
    }).then(canvas => {
        const imageData = canvas.toDataURL('image/png');

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'ticket.png'; // The name of the downloaded file

        // Programmatically click the link to trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});

function changeTemplate(i) {
    currentTemplate = i;
    
    // Set background and content box
    let imageUrl = "url('../images/background" + i + ".jpeg')";
    document.getElementById('full-ticket').style.backgroundImage = imageUrl;
    for (let j=1; j<=6; j++) {
        document.getElementById('content-box-' + j).style.display = 'none';
    }
    document.getElementById('content-box-' + i).style.display = 'flex';
    document.getElementById('colour1').style.backgroundImage = "url('../images/template-thumbs/background" + i + ".jpeg')";
    document.getElementById('colour2').style.backgroundImage = "url('../images/template-thumbs/background" + i + "b.jpeg')";
    document.getElementById('colour3').style.backgroundImage = "url('../images/template-thumbs/background" + i + "c.jpeg')";
    document.getElementById('colour4').style.backgroundImage = "url('../images/template-thumbs/background" + i + "d.jpeg')";
    document.getElementById('colour5').style.backgroundImage = "url('../images/template-thumbs/background" + i + "e.jpeg')";

    // Show/hide optional fields
    document.getElementById('price-row').hidden = document.getElementById('ticket-price-' + i) === null;
    document.getElementById('address-row').hidden = document.getElementById('ticket-address-' + i) === null;

    // Specific changes for background 6
    if (currentTemplate === 6) {
        document.getElementById('ticket-band-name-6').style.fontFamily = window.getComputedStyle(document.getElementById('font21')).fontFamily;
    }
    
    document.getElementById('promoter-row').hidden = currentTemplate === 6;
    document.getElementById('support-row').hidden = currentTemplate === 6;
    document.getElementById('venue-row').hidden = currentTemplate === 6;
    document.getElementById('show-doors-row').hidden = currentTemplate === 6;
    document.getElementById('type-row').hidden = currentTemplate === 6;
    document.getElementById('font-dropdown').style.display = (currentTemplate === 6 ? 'none' : 'block');

    dispatchEvents();
    setOverrideData()
}

function setOverrideData(checkbox = null, colour = null) {
    const ticketFields = ['ticket-promoter-','ticket-band-name-','ticket-band-other-','ticket-date-time-',
                          'ticket-doors-','ticket-venue-','ticket-address-','ticket-type-','ticket-price-'];
    
    for (const field of ticketFields) {
        const element = document.getElementById(field + currentTemplate);
        if (element !== null) {
            if (checkbox === null) {
                if (element.getAttribute('data-font-size') !== null) {
                    element.style.fontSize = element.getAttribute('data-font-size');
                }
            } else if (checkbox.checked) {
                element.style.color = colour;
            }
        }
    }
}

function swapBackground(index) {
    document.getElementById('full-ticket').style.backgroundImage = "url('../images/background" + currentTemplate + index + ".jpeg')";
}

function fitText(element, maxFontSize) {
    if (currentTemplate === 6) {
        maxFontSize = 20;
    }
    element.style.fontSize = `${maxFontSize}pt`;
    if (storeOnComplete) {
        element.setAttribute('data-font-size', `${maxFontSize}pt`);
    } else if (clearOnComplete) {
        element.removeAttribute('data-font-size');
    }
    requestAnimationFrame(() => shrinkStep(element, maxFontSize));
}

function shrinkStep(element, currentSize) {
    let correction = 0;
    let container = document.getElementById('inner-content-box-' + currentTemplate);
    if (container === null) {
        container = document.getElementById('content-box-' + currentTemplate);
        correction = 40;
    }
    while (element.scrollWidth > container.clientWidth-correction && currentSize > 1) {
        currentSize--;
        element.style.fontSize = `${currentSize}pt`;
        if (storeOnComplete) {
            element.setAttribute('data-font-size', `${currentSize}pt`);
        } else if (clearOnComplete) {
            element.removeAttribute('data-font-size');
        }
        requestAnimationFrame(() => shrinkStep(element, currentSize));
    }
}

function setFontAndResize(id) {
    currentElement.style.fontFamily = window.getComputedStyle(document.getElementById(id)).fontFamily;
    fitText(currentElement, getFontSizeVal(currentElement));
    if (relatedElement !== null) {
        requestAnimationFrame(() => setRelatedFontAndSize(id));
    }
}

function setRelatedFontAndSize(id) {
    relatedElement.style.fontFamily = window.getComputedStyle(document.getElementById(id)).fontFamily;
    relatedElement.style.fontSize = currentElement.style.fontSize;
    if (storeOnComplete) relatedElement.setAttribute('data-font-size', currentElement.style.fontSize);
}

function getFontSizeVal(element) {
    if (currentElement === 6) {
        return 20;
    }
    return element.style.fontSize.replace(/[^0-9]+?$/, '');
}

function rgb2hex(rgbString) {
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  if (!match) {
    return '#000000';
  }

  const toHex = (c) => {
    const num = parseInt(c, 10);
    // Convert to hex and pad with a leading zero if it's a single digit.
    return num.toString(16).padStart(2, '0');
  };
  
  const r = toHex(match[1]);
  const g = toHex(match[2]);
  const b = toHex(match[3]);

  return `#${r}${g}${b}`;
}

function doAge(checkbox) {
    if(checkbox.checked) {
        document.getElementById('content-box-' + currentTemplate).classList.remove('content-box-no-after');
    } else {
        document.getElementById('content-box-' + currentTemplate).classList.add('content-box-no-after');
    }
}

function showDoors(checkbox) {
    if(checkbox.checked) {
        document.getElementById('ticket-doors-' + currentTemplate).style.display = 'block';
    } else {
        document.getElementById('ticket-doors-' + currentTemplate).style.display = 'none';
    }
}

function showBookingFee(checkbox) {
    const feeImg = document.getElementById('ticket-fee');
    if(checkbox.checked) {
        feeImg.style.display = 'block';
        feeImg.style.top = (Math.floor(Math.random() * (26)) + 35) + '%';
        feeImg.style.left = (Math.floor(Math.random() * (26))) + '%';
        feeImg.style.transform = 'rotate(' + (Math.floor(Math.random() * (171)) - 85) + 'deg)';
    } else {
        feeImg.style.display = 'none';
    }
}

function formatDateTime(dateString) {
    if (!dateString) {
        return "Please select a date and time.";
    }

    const date = new Date(dateString);

    // Get the day number to calculate the ordinal suffix
    const day = date.getDate();
    const dayWithOrdinal = getDayWithOrdinal(day);

    // Format the date into parts we can use
    const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
    const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
    const year = date.getFullYear();
    const monthNum = date.getMonth()+1;

    // Format the time
    const time = new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(date);

    if (currentTemplate === 6) {
        document.getElementById('ticket-date-time-' + currentTemplate).innerHTML = `${day} . ${monthNum} . ${year}`;
    } else {
        document.getElementById('ticket-date-time-' + currentTemplate).innerHTML = `${weekday} ${dayWithOrdinal} ${month} ${year}`;
        document.getElementById('ticket-doors-' + currentTemplate).innerHTML = `Doors ${time.toLowerCase()}`;
    }
}

function getDayWithOrdinal(day) {
    if (day > 3 && day < 21) return `${day}th`; // Covers 4th-20th
    switch (day % 10) {
        case 1:  return `${day}st`;
        case 2:  return `${day}nd`;
        case 3:  return `${day}rd`;
        default: return `${day}th`;
    }
}

function showSettings(settingsField, maxFontSize, relatedField = null) {
    currentElement = document.getElementById(settingsField + '-' + currentTemplate);
    if (relatedField !== null) {
        relatedElement = document.getElementById(relatedField + '-' + currentTemplate);
    } else {
        relatedElement = null;
    }
    document.getElementById('dropdown-button').style.fontFamily = currentElement.style.fontFamily;
    document.getElementById('size').max = maxFontSize;
    document.getElementById('size').value = getFontSizeVal(currentElement);
    document.getElementById('color-picker').value = rgb2hex(currentElement.style.color);
    let opacity = currentElement.style.opacity;
    document.getElementById('fade').value = (opacity < 0.1 ? 80 : currentElement.style.opacity * 100);
    document.getElementById('settings').style.display = 'flex';
    document.getElementById('apply-colour').checked = false;
    
    storeOnComplete = true;
    return false;
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    storeOnComplete = false;
    return true;
}

function setPresets(gigId) {
    let dataDiv = document.getElementById(gigId + '-data');
    let dataPromoter = dataDiv.getAttribute('data-promoter');
    let dataBand = dataDiv.getAttribute('data-band');
    let dataOther = dataDiv.getAttribute('data-other');
    let dataDateTime = dataDiv.getAttribute('data-dt');
    let dataVenue = dataDiv.getAttribute('data-venue');
    let dataAddress = dataDiv.getAttribute('data-address');
    let dataType = dataDiv.getAttribute('data-type');
    let dataPrice = dataDiv.getAttribute('data-price');
    promoter.value = dataPromoter;
    bandName.value = dataBand;
    bandOther.value = dataOther;
    venue.value = dataVenue;
    address.value = dataAddress;
    gigDateTime.value = dataDateTime;
    price.value = dataPrice;

    for(var i = 0;i < typeSelect.length;i++){
        if(typeSelect.options[i].value === dataType ){
            typeSelect.selectedIndex = i;
            break;
        }
    }
    
    dispatchEvents();
}

function dispatchEvents() {
    var e = new Event('input');
    var e2 = new Event('change');
    clearOnComplete = false;
    if (promoter.value.length > 0) promoter.dispatchEvent(e);
    if (bandName.value.length > 0) bandName.dispatchEvent(e);
    if (bandOther.value.length > 0) bandOther.dispatchEvent(e);
    if (venue.value.length > 0) venue.dispatchEvent(e);
    if (address.value.length > 0) address.dispatchEvent(e);
    gigDateTime.dispatchEvent(e);
    typeSelect.dispatchEvent(e2);
    if (price.value.length > 0) price.dispatchEvent(e);
    clearOnComplete = true;
}

function getRandomLetter(start, max) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomIndex = Math.floor(Math.random() * (max - start + 1)) + start;
    return alphabet[randomIndex];
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}
