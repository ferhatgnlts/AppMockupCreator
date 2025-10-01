/*
 * Copyright (C) 2025 Ferhat Gönültaş (github.com/ferhatgnlts)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
 


document.addEventListener('DOMContentLoaded', function() {
    const mockupsContainer = document.getElementById('mockups-container');
    const modal = document.getElementById('customization-modal');
    const closeModal = document.querySelector('.close-modal');
    const applyBtn = document.getElementById('apply-btn');
    const resetBtn = document.getElementById('reset-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const createNewBtn = document.getElementById('create-new-btn');
    const exportAllBtn = document.getElementById('export-all-btn');
    const loading = document.getElementById('loading');
    
    // Form elements
    const headerText = document.getElementById('header-text');
    const textSize = document.getElementById('text-size');
    const textAlignRadios = document.querySelectorAll('input[name="text-align"]');
    const textMarginTop = document.getElementById('text-margin-top');
    const textMarginBottom = document.getElementById('text-margin-bottom');
    const textMarginLeft = document.getElementById('text-margin-left');
    const textMarginRight = document.getElementById('text-margin-right');
    const headerBgToggle = document.getElementById('header-bg-toggle');
    const useGradient = document.getElementById('use-gradient');
    const solidColorControls = document.getElementById('solid-color-controls');
    const gradientControls = document.getElementById('gradient-controls');
    const pageBgColor = document.getElementById('page-bg-color');
    const pageBgColorText = document.getElementById('page-bg-color-text');
    const gradientColor1 = document.getElementById('gradient-color-1');
    const gradientColor1Text = document.getElementById('gradient-color-1-text');
    const gradientColor2 = document.getElementById('gradient-color-2');
    const gradientColor2Text = document.getElementById('gradient-color-2-text');
    const gradientPreview = document.getElementById('gradient-preview');
    const gradientDirectionRadios = document.querySelectorAll('input[name="gradient-direction"]');
    const headerColor = document.getElementById('header-color');
    const headerColorText = document.getElementById('header-color-text');
    const phoneColor = document.getElementById('phone-color');
    const phoneColorText = document.getElementById('phone-color-text');
    const textColor = document.getElementById('text-color');
    const textColorText = document.getElementById('text-color-text');
    const phoneWidth = document.getElementById('phone-width');
    const phoneHeight = document.getElementById('phone-height');
    const phoneMarginTop = document.getElementById('phone-margin-top');
    const phoneMarginBottom = document.getElementById('phone-margin-bottom');
    const phoneMarginLeft = document.getElementById('phone-margin-left');
    const phoneMarginRight = document.getElementById('phone-margin-right');
    const notchToggle = document.getElementById('notch-toggle');
    const speakerToggle = document.getElementById('speaker-toggle');
    const roundedCorners = document.getElementById('rounded-corners');
    const screenImage = document.getElementById('screen-image');
    const imageFitRadios = document.querySelectorAll('input[name="image-fit"]');
    
    let currentMockup = null;
    let mockupCount = 0;
    
    // Create first mockup
    createNewMockup();
    
    // Toggle between solid color and gradient
    useGradient.addEventListener('change', function() {
        if (this.checked) {
            solidColorControls.style.display = 'none';
            gradientControls.style.display = 'block';
            updateGradientPreview();
        } else {
            solidColorControls.style.display = 'block';
            gradientControls.style.display = 'none';
        }
    });
    
    // Update gradient preview when colors change
    gradientColor1.addEventListener('input', function() {
        gradientColor1Text.value = this.value;
        updateGradientPreview();
    });
    
    gradientColor1Text.addEventListener('input', function() {
        if (this.value.startsWith('#')) {
            gradientColor1.value = this.value;
            updateGradientPreview();
        }
    });
    
    gradientColor2.addEventListener('input', function() {
        gradientColor2Text.value = this.value;
        updateGradientPreview();
    });
    
    gradientColor2Text.addEventListener('input', function() {
        if (this.value.startsWith('#')) {
            gradientColor2.value = this.value;
            updateGradientPreview();
        }
    });
    
    // Update gradient preview when direction changes
    gradientDirectionRadios.forEach(radio => {
        radio.addEventListener('change', updateGradientPreview);
    });
    
    // Sync color inputs
    pageBgColor.addEventListener('input', function() {
        pageBgColorText.value = this.value;
    });
    
    pageBgColorText.addEventListener('input', function() {
        if (this.value.startsWith('#')) {
            pageBgColor.value = this.value;
        }
    });
    
    headerColor.addEventListener('input', function() {
        headerColorText.value = this.value;
    });
    
    headerColorText.addEventListener('input', function() {
        if (this.value.startsWith('#')) {
            headerColor.value = this.value;
        }
    });
    
    phoneColor.addEventListener('input', function() {
        phoneColorText.value = this.value;
    });
    
    phoneColorText.addEventListener('input', function() {
        if (this.value.startsWith('#')) {
            phoneColor.value = this.value;
        }
    });
    
    textColor.addEventListener('input', function() {
        textColorText.value = this.value;
    });
    
    textColorText.addEventListener('input', function() {
        if (this.value.startsWith('#')) {
            textColor.value = this.value;
        }
    });
    
    // Create new mockup
    createNewBtn.addEventListener('click', function() {
        createNewMockup();
    });
    
    // Download all mockups as ZIP
    exportAllBtn.addEventListener('click', function() {
        exportAllMockups();
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Apply button
    applyBtn.addEventListener('click', function() {
        if (currentMockup) {
            applyChanges();
            modal.style.display = 'none';
        }
    });
    
    // Reset button
    resetBtn.addEventListener('click', function() {
        if (currentMockup) {
            resetToDefaults();
        }
    });
    
    // Delete button
    deleteBtn.addEventListener('click', function() {
        if (currentMockup && mockupsContainer.children.length > 1) {
            mockupsContainer.removeChild(currentMockup.parentElement);
            modal.style.display = 'none';
        } else if (mockupsContainer.children.length === 1) {
            alert('At least one mockup is required!');
        }
    });
    
    // Change screen image
    screenImage.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && currentMockup) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const phoneImage = currentMockup.querySelector('.phone-screen img');
                const defaultScreenText = currentMockup.querySelector('.phone-screen p');
                
                // Get alignment option
                let selectedFit = 'cover';
                for (const radio of imageFitRadios) {
                    if (radio.checked) {
                        selectedFit = radio.value;
                        break;
                    }
                }
                
                phoneImage.src = e.target.result;
                phoneImage.style.display = 'block';
                phoneImage.className = `object-fit-${selectedFit}`;
                defaultScreenText.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Listen for image alignment changes
    for (const radio of imageFitRadios) {
        radio.addEventListener('change', function() {
            if (currentMockup) {
                const phoneImage = currentMockup.querySelector('.phone-screen img');
                if (phoneImage.style.display !== 'none') {
                    phoneImage.className = `object-fit-${this.value}`;
                }
            }
        });
    }
    
    // Update gradient preview
    function updateGradientPreview() {
        let selectedDirection = 'to right';
        for (const radio of gradientDirectionRadios) {
            if (radio.checked) {
                selectedDirection = radio.value;
                break;
            }
        }
        
        let gradientValue;
        if (selectedDirection === 'radial') {
            gradientValue = `radial-gradient(circle, ${gradientColor1.value}, ${gradientColor2.value})`;
        } else {
            gradientValue = `linear-gradient(${selectedDirection}, ${gradientColor1.value}, ${gradientColor2.value})`;
        }
        
        gradientPreview.style.background = gradientValue;
    }
    
    // Create new mockup function
    function createNewMockup() {
        mockupCount++;
        
        const mockupWrapper = document.createElement('div');
        mockupWrapper.className = 'mockup-wrapper';
        
        const container = document.createElement('div');
        container.className = 'container';
        
        container.innerHTML = `
            <div class="header">
                <div class="header-text">Phone Mockup ${mockupCount}</div>
            </div>
            <div class="phone-container">
                <div class="phone">
                    <div class="phone-notch"></div>
                    <div class="phone-speaker"></div>
                    <div class="phone-screen">
                        <img src="" alt="Phone Screen">
                        <p class="default-screen-text">Screen is empty</p>
                    </div>
                    <div class="phone-buttons">
                        <div class="phone-button"></div>
                        <div class="phone-button"></div>
                    </div>
                </div>
            </div>
        `;
        
        const mockupActions = document.createElement('div');
        mockupActions.className = 'mockup-actions';
        mockupActions.innerHTML = `
            <button class="btn btn-secondary customize-btn">
                <span>🎨</span> Customize
            </button>
            <button class="btn btn-success download-btn">
                <span>📥</span> Download
            </button>
        `;
        
        mockupWrapper.appendChild(container);
        mockupWrapper.appendChild(mockupActions);
        mockupsContainer.appendChild(mockupWrapper);
        
        // Set default sizes
        const phone = mockupWrapper.querySelector('.phone');
        const phoneScreen = mockupWrapper.querySelector('.phone-screen');
        const phoneNotch = mockupWrapper.querySelector('.phone-notch');
        const phoneSpeaker = mockupWrapper.querySelector('.phone-speaker');
        const headerTextElement = mockupWrapper.querySelector('.header-text');
        
        // Set default text alignment, margin and size
        headerTextElement.style.textAlign = 'center';
        headerTextElement.style.margin = '0';
        headerTextElement.style.fontSize = '20px';
        
        updatePhoneSize(phone, phoneScreen, phoneNotch, phoneSpeaker, 280, 560, true);
        
        // Add click event to customize button
        const customizeBtn = mockupWrapper.querySelector('.customize-btn');
        customizeBtn.addEventListener('click', function() {
            openCustomizationModal(mockupWrapper);
        });
        
        // Add click event to download button
        const downloadBtn = mockupWrapper.querySelector('.download-btn');
        downloadBtn.addEventListener('click', function() {
            downloadMockup(mockupWrapper);
        });
        
        // Add click event to container
        container.addEventListener('click', function() {
            openCustomizationModal(mockupWrapper);
        });
    }
    
    // Update phone sizes
    function updatePhoneSize(phone, phoneScreen, phoneNotch, phoneSpeaker, width, height, rounded) {
        // Phone is centered in the container
        const container = phone.parentElement;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        phone.style.width = width + 'px';
        phone.style.height = height + 'px';
        
        // Apply margin to phone position
        const marginTop = parseInt(phone.style.marginTop) || 0;
        const marginBottom = parseInt(phone.style.marginBottom) || 0;
        const marginLeft = parseInt(phone.style.marginLeft) || 0;
        const marginRight = parseInt(phone.style.marginRight) || 0;
        
        phone.style.left = ((containerWidth - width) / 2 + marginLeft - marginRight) + 'px';
        phone.style.top = ((containerHeight - height) / 2 + marginTop - marginBottom) + 'px';
        
        // Corner rounding
        if (rounded) {
            phone.style.borderRadius = '35px';
            phoneScreen.style.borderRadius = '22px';
            phoneNotch.style.borderRadius = '0 0 12px 12px';
        } else {
            phone.style.borderRadius = '0';
            phoneScreen.style.borderRadius = '0';
            phoneNotch.style.borderRadius = '0';
        }
        
        // Screen sizes (14px gap inside phone)
        const screenWidth = width - 28;
        const screenHeight = height - 28;
        phoneScreen.style.width = screenWidth + 'px';
        phoneScreen.style.height = screenHeight + 'px';
        phoneScreen.style.top = '14px';
        phoneScreen.style.left = '14px';
        
        // Notch sizes
        const notchWidth = width * 0.5;
        const notchHeight = height * 0.045;
        phoneNotch.style.width = notchWidth + 'px';
        phoneNotch.style.height = notchHeight + 'px';
        
        // Speaker sizes
        const speakerWidth = width * 0.3;
        const speakerHeight = height * 0.014;
        phoneSpeaker.style.width = speakerWidth + 'px';
        phoneSpeaker.style.height = speakerHeight + 'px';
    }
    
    // Open customization modal
    function openCustomizationModal(mockupWrapper) {
        currentMockup = mockupWrapper.querySelector('.container');
        const phone = currentMockup.querySelector('.phone');
        const phoneContainer = currentMockup.querySelector('.phone-container');
        const header = currentMockup.querySelector('.header');
        const headerTextElement = currentMockup.querySelector('.header-text');
        const phoneNotch = currentMockup.querySelector('.phone-notch');
        const phoneSpeaker = currentMockup.querySelector('.phone-speaker');
        const phoneImage = currentMockup.querySelector('.phone-screen img');
        
        // Load current values into form
        headerText.value = headerTextElement.textContent;
        
        // Text size
        textSize.value = parseInt(headerTextElement.style.fontSize) || 20;
        
        // Text alignment
        const currentAlign = headerTextElement.style.textAlign || 'center';
        document.querySelector(`input[name="text-align"][value="${currentAlign}"]`).checked = true;
        
        // Text margin
        const textMargin = headerTextElement.style.margin || '0px 0px 0px 0px';
        const marginValues = textMargin.split(' ').map(val => parseInt(val) || 0);
        textMarginTop.value = marginValues[0] || 0;
        textMarginRight.value = marginValues[1] || 0;
        textMarginBottom.value = marginValues[2] || 0;
        textMarginLeft.value = marginValues[3] || 0;
        
        headerBgToggle.checked = !header.classList.contains('no-bg');
        
        // Page background type
        const containerBg = phoneContainer.style.background || '';
        if (containerBg.includes('gradient')) {
            useGradient.checked = true;
            solidColorControls.style.display = 'none';
            gradientControls.style.display = 'block';
            
            // Extract gradient colors from background
            const gradientMatch = containerBg.match(/linear-gradient\(([^,]+), ([^,]+), ([^)]+)\)/) || 
                                 containerBg.match(/radial-gradient\([^,]+, ([^,]+), ([^)]+)\)/);
            
            if (gradientMatch) {
                if (containerBg.includes('radial')) {
                    gradientColor1.value = rgbToHex(gradientMatch[1]);
                    gradientColor1Text.value = gradientColor1.value;
                    gradientColor2.value = rgbToHex(gradientMatch[2]);
                    gradientColor2Text.value = gradientColor2.value;
                    document.getElementById('gradient-radial').checked = true;
                } else {
                    gradientColor1.value = rgbToHex(gradientMatch[2]);
                    gradientColor1Text.value = gradientColor1.value;
                    gradientColor2.value = rgbToHex(gradientMatch[3]);
                    gradientColor2Text.value = gradientColor2.value;
                    
                    // Set direction
                    const direction = gradientMatch[1];
                    if (direction.includes('to bottom right')) {
                        document.getElementById('gradient-to-bottom-right').checked = true;
                    } else if (direction.includes('to bottom')) {
                        document.getElementById('gradient-to-bottom').checked = true;
                    } else {
                        document.getElementById('gradient-to-right').checked = true;
                    }
                }
            }
            updateGradientPreview();
        } else {
            useGradient.checked = false;
            solidColorControls.style.display = 'block';
            gradientControls.style.display = 'none';
            
            // Page background
            const pageBg = phoneContainer.style.backgroundColor;
            const hexColor = rgbToHex(pageBg || '#e9ecef');
            pageBgColor.value = hexColor;
            pageBgColorText.value = hexColor;
        }
        
        // Header background
        const headerBg = header.style.backgroundColor;
        const headerHexColor = rgbToHex(headerBg || '#4a6fa5');
        headerColor.value = headerHexColor;
        headerColorText.value = headerHexColor;
        
        phoneColor.value = rgbToHex(phone.style.backgroundColor || '#333333');
        phoneColorText.value = phoneColor.value;
        textColor.value = rgbToHex(header.style.color || '#ffffff');
        textColorText.value = textColor.value;
        
        // Phone sizes
        phoneWidth.value = parseInt(phone.style.width) || 280;
        phoneHeight.value = parseInt(phone.style.height) || 560;
        
        // Phone margin
        phoneMarginTop.value = parseInt(phone.style.marginTop) || 0;
        phoneMarginBottom.value = parseInt(phone.style.marginBottom) || 0;
        phoneMarginLeft.value = parseInt(phone.style.marginLeft) || 0;
        phoneMarginRight.value = parseInt(phone.style.marginRight) || 0;
        
        // Controls
        notchToggle.checked = !phoneNotch.classList.contains('hidden');
        speakerToggle.checked = !phoneSpeaker.classList.contains('hidden');
        roundedCorners.checked = phone.style.borderRadius !== '0px';
        
        // Load current image alignment
        if (phoneImage.className.includes('contain')) {
            document.getElementById('fit-contain').checked = true;
        } else if (phoneImage.className.includes('fill')) {
            document.getElementById('fit-fill').checked = true;
        } else {
            document.getElementById('fit-cover').checked = true;
        }
        
        modal.style.display = 'flex';
    }
    
    // Apply changes
    function applyChanges() {
        const header = currentMockup.querySelector('.header');
        const phoneContainer = currentMockup.querySelector('.phone-container');
        const phone = currentMockup.querySelector('.phone');
        const phoneScreen = currentMockup.querySelector('.phone-screen');
        const phoneNotch = currentMockup.querySelector('.phone-notch');
        const phoneSpeaker = currentMockup.querySelector('.phone-speaker');
        const headerTextElement = currentMockup.querySelector('.header-text');
        const phoneImage = currentMockup.querySelector('.phone-screen img');
        
        // Apply values
        headerTextElement.textContent = headerText.value || 'Phone Mockup';
        
        // Text size
        headerTextElement.style.fontSize = (textSize.value || 20) + 'px';
        
        // Text alignment
        let selectedAlign = 'center';
        for (const radio of textAlignRadios) {
            if (radio.checked) {
                selectedAlign = radio.value;
                break;
            }
        }
        headerTextElement.style.textAlign = selectedAlign;
        
        // Text margin
        const textTop = textMarginTop.value || 0;
        const textRight = textMarginRight.value || 0;
        const textBottom = textMarginBottom.value || 0;
        const textLeft = textMarginLeft.value || 0;
        headerTextElement.style.margin = `${textTop}px ${textRight}px ${textBottom}px ${textLeft}px`;
        
        // Page background
        if (useGradient.checked) {
            let selectedDirection = 'to right';
            for (const radio of gradientDirectionRadios) {
                if (radio.checked) {
                    selectedDirection = radio.value;
                    break;
                }
            }
            
            let gradientValue;
            if (selectedDirection === 'radial') {
                gradientValue = `radial-gradient(circle, ${gradientColor1.value}, ${gradientColor2.value})`;
            } else {
                gradientValue = `linear-gradient(${selectedDirection}, ${gradientColor1.value}, ${gradientColor2.value})`;
            }
            
            phoneContainer.style.background = gradientValue;
            phoneContainer.style.backgroundColor = '';
        } else {
            phoneContainer.style.backgroundColor = pageBgColorText.value;
            phoneContainer.style.background = '';
        }
        
        // Header background control
        if (headerBgToggle.checked) {
            header.style.backgroundColor = headerColorText.value;
            header.classList.remove('no-bg');
        } else {
            // Make header background same as page background
            if (useGradient.checked) {
                header.style.background = phoneContainer.style.background;
                header.style.backgroundColor = '';
            } else {
                header.style.backgroundColor = phoneContainer.style.backgroundColor;
                header.style.background = '';
            }
            header.classList.add('no-bg');
        }
        
        phone.style.backgroundColor = phoneColorText.value;
        header.style.color = textColorText.value;
        
        // Phone margin
        phone.style.marginTop = (phoneMarginTop.value || 0) + 'px';
        phone.style.marginBottom = (phoneMarginBottom.value || 0) + 'px';
        phone.style.marginLeft = (phoneMarginLeft.value || 0) + 'px';
        phone.style.marginRight = (phoneMarginRight.value || 0) + 'px';
        
        // Update phone sizes
        updatePhoneSize(
            phone, 
            phoneScreen, 
            phoneNotch, 
            phoneSpeaker,
            parseInt(phoneWidth.value) || 280,
            parseInt(phoneHeight.value) || 560,
            roundedCorners.checked
        );
        
        // Notch control
        if (notchToggle.checked) {
            phoneNotch.classList.remove('hidden');
        } else {
            phoneNotch.classList.add('hidden');
        }
        
        // Speaker control
        if (speakerToggle.checked) {
            phoneSpeaker.classList.remove('hidden');
        } else {
            phoneSpeaker.classList.add('hidden');
        }
        
        // Image alignment control
        let selectedFit = 'cover';
        for (const radio of imageFitRadios) {
            if (radio.checked) {
                selectedFit = radio.value;
                break;
            }
        }
        
        // Update current image alignment
        if (phoneImage.style.display !== 'none') {
            phoneImage.className = `object-fit-${selectedFit}`;
        }
    }
    
    // Reset to defaults
    function resetToDefaults() {
        headerText.value = 'Phone Mockup';
        textSize.value = 20;
        document.getElementById('align-center').checked = true;
        textMarginTop.value = 0;
        textMarginBottom.value = 0;
        textMarginLeft.value = 0;
        textMarginRight.value = 0;
        headerBgToggle.checked = true;
        useGradient.checked = false;
        solidColorControls.style.display = 'block';
        gradientControls.style.display = 'none';
        pageBgColor.value = '#e9ecef';
        pageBgColorText.value = '#e9ecef';
        gradientColor1.value = '#4a6fa5';
        gradientColor1Text.value = '#4a6fa5';
        gradientColor2.value = '#e9ecef';
        gradientColor2Text.value = '#e9ecef';
        document.getElementById('gradient-to-right').checked = true;
        headerColor.value = '#4a6fa5';
        headerColorText.value = '#4a6fa5';
        phoneColor.value = '#333333';
        phoneColorText.value = '#333333';
        textColor.value = '#ffffff';
        textColorText.value = '#ffffff';
        phoneWidth.value = 280;
        phoneHeight.value = 560;
        phoneMarginTop.value = 0;
        phoneMarginBottom.value = 0;
        phoneMarginLeft.value = 0;
        phoneMarginRight.value = 0;
        notchToggle.checked = true;
        speakerToggle.checked = true;
        roundedCorners.checked = true;
        screenImage.value = '';
        
        // Default alignment
        document.getElementById('fit-cover').checked = true;
        
        // Apply changes
        applyChanges();
    }
    
    // Convert RGB color value to HEX
    function rgbToHex(rgb) {
        if (!rgb) return '#ffffff';
        if (rgb.startsWith('#')) return rgb;
        if (rgb === 'transparent') return '#ffffff';
        
        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues || rgbValues.length < 3) return '#000000';
        
        const r = parseInt(rgbValues[0]).toString(16).padStart(2, '0');
        const g = parseInt(rgbValues[1]).toString(16).padStart(2, '0');
        const b = parseInt(rgbValues[2]).toString(16).padStart(2, '0');
        
        return `#${r}${g}${b}`;
    }
    
    // Download single mockup
    async function downloadMockup(mockupWrapper) {
        const container = mockupWrapper.querySelector('.container');
        
        loading.style.display = 'flex';
        
        try {
            // Remove corner rounding
            const originalBorderRadius = container.style.borderRadius;
            container.style.borderRadius = '0';
            
            // Create high-resolution canvas
            const canvas = await html2canvas(container, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null
            });
            
            // Restore original value
            container.style.borderRadius = originalBorderRadius;
            
            const imageData = canvas.toDataURL('image/png');
            
            // Create blob from data URL
            const blob = await (await fetch(imageData)).blob();
            
            // Download
            saveAs(blob, `phone-mockup-${Date.now()}.png`);
        } catch (error) {
            console.error('Image generation error:', error);
            alert('An error occurred while generating the image. Please try again.');
        } finally {
            loading.style.display = 'none';
        }
    }
    
    // Download all mockups as ZIP
    async function exportAllMockups() {
        const mockups = mockupsContainer.querySelectorAll('.mockup-wrapper');
        
        if (mockups.length === 0) {
            alert('No mockups found to download.');
            return;
        }
        
        loading.style.display = 'flex';
        const zip = new JSZip();
        
        try {
            for (let i = 0; i < mockups.length; i++) {
                const mockup = mockups[i];
                const container = mockup.querySelector('.container');
                
                // Remove corner rounding
                const originalBorderRadius = container.style.borderRadius;
                container.style.borderRadius = '0';
                
                // Create high-resolution canvas
                const canvas = await html2canvas(container, {
                    scale: 3,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null
                });
                
                // Restore original value
                container.style.borderRadius = originalBorderRadius;
                
                const imageData = canvas.toDataURL('image/png');
                
                // Create blob from data URL
                const blob = await (await fetch(imageData)).blob();
                
                // Add to ZIP
                zip.file(`phone-mockup-${i+1}.png`, blob);
            }
            
            // Create and download ZIP
            const content = await zip.generateAsync({type: 'blob'});
            saveAs(content, 'phone-mockups.zip');
        } catch (error) {
            console.error('ZIP creation error:', error);
            alert('An error occurred while creating the ZIP file. Please try again.');
        } finally {
            loading.style.display = 'none';
        }
    }
    
    // Initialize gradient preview
    updateGradientPreview();
});
