import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Slider from 'components/ui/Slider';

interface Props {
  className?: string;
  originalNFT: File;
  coverNFT: File;
  showThumbnailSelector: boolean;
  thumbnailTimecode: number;
  setThumbnailTimecode: (x: number) => void
}

const secToMn = (n: number) => `${(n/60)<10?'0':''}${Math.floor(n/60)}:${(n%60)<10?'0':''}${Math.floor(n%60)}`

const ThumbnailSelector = ({
  className,
  originalNFT,
  coverNFT,
  showThumbnailSelector,
  thumbnailTimecode,
  setThumbnailTimecode
}: Props) => {
  const [thumbnailDuration, setThumbnailDuration] = useState(0)
  const [thumbnailSrc, setThumbnailSrc] = useState("")
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const thumbnailRef = useRef(null);
  
  useEffect(() => {
    if (showThumbnailSelector) {
      setThumbnailSrc(URL.createObjectURL((coverNFT || originalNFT) as File))
      setThumbnailTimecode(0)
      getThumbnailDuration()
    }
  }, [originalNFT, coverNFT])

  useEffect(() => {
    if (thumbnailRef?.current!==null){
      const newVideoElement = (thumbnailRef.current) as HTMLVideoElement
      if (!videoElement || videoElement.currentSrc !== newVideoElement.currentSrc){
        setVideoElement(newVideoElement)
      }
    }
  }, [thumbnailRef?.current]);

  const getThumbnailDuration = () => {
    const video = document.createElement('video')
    video.preload = 'metadata';
    video.onloadedmetadata = function() {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      setThumbnailDuration(duration)
    }
    video.src = URL.createObjectURL((coverNFT || originalNFT) as File)
  }

  useEffect(() => {
    if (videoElement){
      videoElement.currentTime = thumbnailTimecode
    }
  }, [thumbnailTimecode]);

  return (
    <SThumbnailSelectorContainer className={className}>
      <SThumbnailVideo
        autoPlay={false}
        muted={true}
        controls={false}
        poster={undefined}
        ref={thumbnailRef}
        src={thumbnailSrc}
      />
      <SThumbnailSelector>
        <SThumbnailTime>{secToMn(thumbnailTimecode)}</SThumbnailTime>
        <SSlider
          id="thumbnailSlider"
          min={0}
          max={thumbnailDuration}
          step={0.01}
          value={thumbnailTimecode}
          onChange={(e) => setThumbnailTimecode(Number(e.target.value))}
        />
        <SThumbnailTime>{secToMn(thumbnailDuration - thumbnailTimecode)}</SThumbnailTime>
      </SThumbnailSelector>
    </SThumbnailSelectorContainer>
  );
};

const SSlider = styled(Slider)`
  width: 100%;
  & > div{
    padding: 0 0.5rem;
    & > input {
      height: 0.8rem;
      border-radius: 0.4rem;
      &::-webkit-slider-thumb{
        width: 1.5rem;
        height: 1.5rem;
      }
      &::-moz-range-thumb{
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }
`;

const SThumbnailSelectorContainer = styled.div`
  text-align: center;
`;

const SThumbnailSelector = styled.div`
  display: flex;
  align-items: center;
`;

const SThumbnailTime = styled.div`
  font-family: 'Airbnb Cereal App Bold';
  color: ${({ theme }) => theme.colors.primary};
`;

const SThumbnailVideo = styled.video`
  width: 60%;
  align-self: center;
  border: solid 2px ${({ theme }) => theme.colors.primary};
  border-radius:0.8rem;
  background-color:${({ theme }) => theme.colors.primary};
  pointer-events: none;
  margin-top: 1.6rem;
`;

export default ThumbnailSelector;
