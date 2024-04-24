import React, { FC, useState, useRef, useEffect } from 'react';
import { useLanguage } from 'contexts/LanguageContextProvider';
import translations from '../../public/assets/js/translations';
import html2canvas from 'html2canvas';

// Define a type for the category structure
type Category = {
  images: string[];
  currentIndex: number;
};

// Initial categories state
const initialCategories: Record<string, Category> = {
  backgrounds: { images: ['/assets/pfp/Backgrounds/000.png','/assets/pfp/Backgrounds/001.png','/assets/pfp/Backgrounds/002.png','/assets/pfp/Backgrounds/003.png','/assets/pfp/Backgrounds/004.png','/assets/pfp/Backgrounds/005.png','/assets/pfp/Backgrounds/006.png','/assets/pfp/Backgrounds/007.png','/assets/pfp/Backgrounds/008.png'], currentIndex: 0 },
  bodies: { images: ['/assets/pfp/Bodies/001.png'], currentIndex: 0 },
  shadows: { images:['/assets/pfp/Shadows/000.png','/assets/pfp/Shadows/001.png','/assets/pfp/Shadows/002.png','/assets/pfp/Shadows/003.png'], currentIndex: 0 },
  mouths: { images: ['/assets/pfp/Mouths/001.png','/assets/pfp/Mouths/002.png','/assets/pfp/Mouths/003.png','/assets/pfp/Mouths/004.png','/assets/pfp/Mouths/005.png','/assets/pfp/Mouths/006.png','/assets/pfp/Mouths/007.png','/assets/pfp/Mouths/008.png','/assets/pfp/Mouths/009.png','/assets/pfp/Mouths/010.png','/assets/pfp/Mouths/011.png','/assets/pfp/Mouths/012.png','/assets/pfp/Mouths/013.png'], currentIndex: 0 },
  eyes: { images: ['/assets/pfp/Eyes/001.png','/assets/pfp/Eyes/002.png','/assets/pfp/Eyes/003.png','/assets/pfp/Eyes/004.png','/assets/pfp/Eyes/005.png','/assets/pfp/Eyes/006.png','/assets/pfp/Eyes/007.png','/assets/pfp/Eyes/008.png','/assets/pfp/Eyes/009.png','/assets/pfp/Eyes/010.png','/assets/pfp/Eyes/011.png','/assets/pfp/Eyes/012.png','/assets/pfp/Eyes/013.png','/assets/pfp/Eyes/014.png','/assets/pfp/Eyes/015.png','/assets/pfp/Eyes/016.png'], currentIndex: 0 },
  expressions: { images: ['/assets/pfp/Expressions/000.png','/assets/pfp/Expressions/001.png','/assets/pfp/Expressions/002.png','/assets/pfp/Expressions/003.png'], currentIndex: 0 },
};

const PfpGenerator: FC = () => {
  
  const [categories, setCategories] = useState(initialCategories);
  const { language } = useLanguage();

  // Function to update image of a specific category
  const updateImage = (category: string, next: boolean) => {
    setCategories((prevCategories) => {
      const len = prevCategories[category].images.length;
      const newCategories = { ...prevCategories };
      newCategories[category].currentIndex = next 
        ? (newCategories[category].currentIndex + 1) % len 
        : (newCategories[category].currentIndex - 1 + len) % len;
      return newCategories;
    });
  };

  function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
  }

  // Function to generate a random PFP
const generatePFP = () => {
  setCategories(prevCategories => {
    const newCategories = {...prevCategories};
    Object.keys(newCategories).forEach(category => {
      // Randomly update the currentIndex for each category
      const len = newCategories[category].images.length;
      newCategories[category].currentIndex = getRandomIndex(len);
    });
    return newCategories;
  });
};


  function savePFP(event) {
    event.preventDefault(); // Prevent the default button behavior
  
    // Temporarily hide the background image if its currentIndex is 0
    const shouldHideBackground = categories.backgrounds.currentIndex === 0;
    if (shouldHideBackground) {
      document.getElementById('backgrounds').style.display = 'none';
    }
  
    // Set backgroundColor to null if the background currentIndex is 0, otherwise use default
    const backgroundColor = shouldHideBackground ? null : undefined;
  
    html2canvas(document.getElementById('pfpContainer'), { backgroundColor }).then(function(canvas) {
      // After capture, reset any changes made for the capture
      if (shouldHideBackground) {
        document.getElementById('backgrounds').style.display = '';
      }
  
      canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.download = 'poot.png';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link); // It's a good practice to append the element to the body
        link.click();
        document.body.removeChild(link); // Clean up by removing the element
        URL.revokeObjectURL(link.href); // Clean up the URL object
      });
    });
  }


  // Convert categories object keys into an array
  const categoryKeys = Object.keys(categories);
  // Function to render category buttons
  const renderCategoryButtons = (category) => (
    <div key={category} className="build__buttonsContainerInner">
      <button className="prevBtn button-small" onClick={() => updateImage(category, false)}>{"<"}</button>
      <p dangerouslySetInnerHTML={{ __html: translations[`build-${category}`][language] }} />
      <button className="nextBtn button-small" onClick={() => updateImage(category, true)}>{">"}</button>
    </div>
  );

  return (
    <div>
      <section className="build__container section container" id="build">
    <div className="build__pfpContainer">
      <div className="build__pfpContainer-img" id="pfpContainer">
      {Object.keys(categories).map((category) => (
          <img
          key={category}
          src={categories[category].images[categories[category].currentIndex]}
          alt={category}
          id={category}
          style={{ position: 'absolute', width: '100%', height: 'auto' }} // Adjust styling as needed
        />
      ))}
      </div>
    </div>
    <div className="home__buttons">
      <button onClick={generatePFP} className="button-primary">
        <p dangerouslySetInnerHTML={{ __html: translations["build-generate"][language] }} />
      </button>
      <button onClick={savePFP} className="button-primary">
        <p dangerouslySetInnerHTML={{ __html: translations["build-save"][language] }} />
      </button>
    </div>
    <div className="build__buttonsContainer">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2">
          {categoryKeys.slice(0, Math.ceil(categoryKeys.length / 2)).map(renderCategoryButtons)}
        </div>
        <div className="flex flex-col gap-2">
          {categoryKeys.slice(Math.ceil(categoryKeys.length / 2)).map(renderCategoryButtons)}
        </div>
      </div>
    </div>
    </section>
  </div>
  );
};

export default PfpGenerator;
