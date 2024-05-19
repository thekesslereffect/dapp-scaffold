// components/MediaDisplay.tsx
import {FC, useState, useEffect } from 'react';

const MemeGenerator: FC = () => {
    const [mediaFiles, setMediaFiles] = useState<{ imageFiles: string[], videoFiles: string[] }>({ imageFiles: [], videoFiles: [] });
    const [currentMedia, setCurrentMedia] = useState<string>('');

    useEffect(() => {
        fetch('/api/memeGenerator/media')
            .then(response => response.json())
            .then(data => setMediaFiles(data));

    }, []);

    const handleRandomMedia = () => {
        const allFiles = [...mediaFiles.imageFiles, ...mediaFiles.videoFiles];
        const randomIndex = Math.floor(Math.random() * allFiles.length);
        setCurrentMedia(allFiles[randomIndex]);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = currentMedia;
        link.download = currentMedia.split('/').pop()!;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isVideo = currentMedia.includes('.mp4') || currentMedia.includes('.MP4') || currentMedia.includes('.MOV');


    return (
      <div>
        <section className="build__container section container" id="build">
        <h2 className="section__title new__title">
          MEME LIBRARY
          </h2>
        <div className="flex-grow">
        <div className="flex justify-center items-center h-full border-dashed border-white border-4 p-8 rounded-[2rem]">
            {currentMedia && (
                <div className="w-full h-96 flex justify-center items-center">
                    {isVideo ? (
                        <video controls className="h-full max-w-full" src={currentMedia}></video>
                    ) : (
                        <img src={currentMedia} alt="Random Media" className="h-full max-w-full object-contain" />
                    )}
                </div>
                )}
                {!currentMedia && (
                  <div className="w-full h-96 flex justify-center items-center">
                      <img src='/memes/images/BlueCheck.png' alt="Random Media" className="h-full max-w-full object-contain" />
                  </div>

                )}
            </div>
        </div>
          <div className="home__buttons mt-10">
            <button onClick={handleRandomMedia} className='button-primary'>Random</button>
            <button onClick={handleDownload} className='button-primary'>Save</button>
          </div>
          
          </section>
        </div>
    );
};

export default MemeGenerator;
