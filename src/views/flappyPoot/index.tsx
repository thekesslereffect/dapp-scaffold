import { FC } from "react";
import FlappyPootGame from "components/games/flappyPoot";

export const FlappyPootView: FC = () => {
  return (
    <div className="hero  bg-black">
      <div className="flex flex-col">
            {/* <div className='mt-20'/>    */}
            <FlappyPootGame />
      </div>
    </div>
  );
};
