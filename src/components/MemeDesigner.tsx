import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Image, Text, Transformer } from 'react-konva';
import useImage from 'use-image';

interface ImageProps {
  src: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  id: string;
  scaleX?: number;
  scaleY?: number;
}

interface TextProps {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  rotation?: number;
  fill: string;
  id: string;
  scaleX?: number;
  scaleY?: number;
}

const BackgroundImage: React.FC<{ src: string; stageWidth: number }> = ({ src, stageWidth }) => {
  const [img] = useImage(src);
  const [dimensions, setDimensions] = useState<{ width: number, height: number, x: number, y: number }>({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    if (img) {
      const aspectRatio = img.width / img.height;
      const width = stageWidth;
      const height = stageWidth / aspectRatio;
      setDimensions({ width, height, x: 0, y: 0 });
    }
  }, [img, stageWidth]);

  return <Image image={img} x={dimensions.x} y={dimensions.y} width={dimensions.width} height={dimensions.height} />;
};

const URLImage: React.FC<{
  image: ImageProps;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: ImageProps) => void;
}> = ({ image, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [img] = useImage(image.src);

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Image
        image={img}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        rotation={image.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        scaleX={image.scaleX}
        scaleY={image.scaleY}
        onDragEnd={(e) => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...image,
              x: node.x(),
              y: node.y(),
              width: node.width(),
              height: node.height(),
              scaleX: scaleX,
              scaleY: scaleY,
              rotation: node.rotation(),
            });
          }
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};

const URLText: React.FC<{
  text: TextProps;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: TextProps) => void;
}> = ({ text, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Text
        text={text.text}
        x={text.x}
        y={text.y}
        fontSize={text.fontSize}
        fontFamily={text.fontFamily}
        rotation={text.rotation}
        fill={text.fill}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        scaleX={text.scaleX}
        scaleY={text.scaleY}
        onDragEnd={(e) => {
          onChange({
            ...text,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            const newFontSize = text.fontSize * scaleX;
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...text,
              x: node.x(),
              y: node.y(),
              fontSize: newFontSize,
              scaleX: 1,
              scaleY: 1,
              rotation: node.rotation(),
            });
          }
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};


const MemeDesigner: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [images, setImages] = useState<ImageProps[]>([]);
  const [texts, setTexts] = useState<TextProps[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stageWidth, setStageWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const addBackgroundImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const addImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((images) => [
          ...images,
          {
            src: reader.result as string,
            x: 50,
            y: 50,
            id: `image${images.length + 1}`,
            scaleX: 1,
            scaleY: 1,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const addText = useCallback(() => {
    setTexts((texts) => [
      ...texts,
      {
        text: 'Edit me',
        x: 50,
        y: 50,
        fontSize: 20,
        fontFamily: 'Jua',
        fill: 'black',
        id: `text${texts.length + 1}`,
        scaleX: 1,
        scaleY: 1,
      },
    ]);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleChangeImage = useCallback((newAttrs: ImageProps) => {
    const img = images.slice();
    const index = img.findIndex((i) => i.id === newAttrs.id);
    img[index] = newAttrs;
    setImages(img);
  }, [images]);

  const handleChangeText = useCallback((newAttrs: TextProps) => {
    const txt = texts.slice();
    const index = txt.findIndex((t) => t.id === newAttrs.id);
    txt[index] = newAttrs;
    setTexts(txt);
  }, [texts]);

  const handleDelete = () => {
    if (selectedId) {
      setImages(images.filter((img) => img.id !== selectedId));
      setTexts(texts.filter((txt) => txt.id !== selectedId));
      setSelectedId(null);
    }
  };

  const handleTextColorChange = (color: string) => {
    if (selectedId && texts.some((text) => text.id === selectedId)) {
      handleChangeText({
        ...texts.find((text) => text.id === selectedId)!,
        fill: color,
      });
    }
  };

  const handleSave = () => {
    const stage = stageRef.current;
    if (stage) {
      const transformer = stage.findOne('Transformer');
      if (transformer) {
        transformer.nodes([]);
        stage.draw();
      }
      const dataURL = stage.toDataURL();
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'meme.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const stageRef = useRef<any>(null);

  return (
    <div>
      <section className="memedesigner__container section w-full">
        <h2 className="section__title new__title">MEME DESIGNER</h2>
        <div className='flex items-center w-full  max-w-3xl h-[560px] self-center justify-center border-dashed border-white border-4 p-4 md:p-8 rounded-[2rem]'>
        <div className="flex flex-col w-full self-center"  ref={containerRef}>
          <Stage
            width={stageWidth}
            height={500}
            ref={stageRef}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedId(null);
              }
            }}
          >
            <Layer>
              {backgroundImage && <BackgroundImage src={backgroundImage} stageWidth={stageWidth} />}
              {images.map((image, i) => (
                <URLImage
                  key={i}
                  image={image}
                  isSelected={image.id === selectedId}
                  onSelect={() => handleSelect(image.id)}
                  onChange={handleChangeImage}
                />
              ))}
              {texts.map((text, i) => (
                <URLText
                  key={i}
                  text={text}
                  isSelected={text.id === selectedId}
                  onSelect={() => handleSelect(text.id)}
                  onChange={handleChangeText}
                />
              ))}
            </Layer>
          </Stage>
        </div>
        </div>
        <div className="mt-4"></div>
        <button className='self-center max-w-sm justify-center button-primary mb-4' onClick={handleSave}>Save Meme</button>
          <button className='self-center max-w-sm justify-center button-secondary' onClick={() => backgroundFileInputRef.current?.click()}>Add Background Image</button>
          <input
            type="file"
            ref={backgroundFileInputRef}
            style={{ display: 'none' }}
            onChange={addBackgroundImage}
            accept="image/*"
          />
          <button className='self-center max-w-sm justify-center button-secondary' onClick={() => imageFileInputRef.current?.click()}>Add Image</button>
          <input
            type="file"
            ref={imageFileInputRef}
            style={{ display: 'none' }}
            onChange={addImage}
            accept="image/*"
          />
          <button className='self-center max-w-sm justify-center button-secondary' onClick={addText}>Add Text</button>
          {selectedId && texts.some((text) => text.id === selectedId) && (
            <div className='flex flex-col max-w-5xl self-center'>
              <input
                type="text"
                className="text-black p-2 text-center flex w-full"
                value={texts.find((text) => text.id === selectedId)?.text || ''}
                onChange={(e) =>
                  handleChangeText({
                    ...texts.find((text) => text.id === selectedId)!,
                    text: e.target.value,
                  })
                }
              />
              <select
                onChange={(e) =>
                  handleChangeText({
                    ...texts.find((text) => text.id === selectedId)!,
                    fontFamily: e.target.value,
                  })
                }
                value={texts.find((text) => text.id === selectedId)?.fontFamily || ''}
              >
                <option value="Jua">Jua</option>
                <option value="Sniglet">Sniglet</option>
                <option value="Impact">Impact</option>
                {/* <option value="Times New Roman">Times New Roman</option> */}
                {/* <option value="Comic Sans MS">Comic Sans MS</option> */}
                
              </select>
              <button className='self-center max-w-sm justify-center button-secondary' onClick={() => handleTextColorChange('black')}>Black</button>
              <button className='self-center max-w-sm justify-center button-secondary' onClick={() => handleTextColorChange('white')}>White</button>
            </div>
          )}
        <button  className='self-center max-w-sm justify-center button-secondary'onClick={handleDelete}>Delete</button>
        
      </section>
    </div>
  );
};

export default MemeDesigner;
