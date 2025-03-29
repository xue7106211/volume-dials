import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import "./VolumeDial.scss";

gsap.registerPlugin(useGSAP, Draggable);

export type VolumeDialProps = {
  ticks: number;
  volume?: number;
  color?: string;
  label?: string;
  children?: React.ReactNode;
};

type VolumeDialDotProps = {
  angle?: number;
  filled?: boolean;
};

function VolumeDialDot({ angle = 0, filled = false }: VolumeDialDotProps) {
  const filledClass = filled === true ? " volume__dot--filled" : "";
  const dotClass = `volume__dot${filledClass}`;
  const dotStyle = {
    transform: `rotate(${angle}deg)`
  };

  return (
    <div className={dotClass} style={dotStyle}></div>
  );
}

export function VolumeDial({ color, ticks, volume = 0, label = "Volume", children }: VolumeDialProps) {
  const [isKeyDown, setIsKeydown] = useState(false);
  const dialRef = useRef<HTMLButtonElement>(null);
  const rootClass = `volume${color ? ` volume--${color}` : ''}`;
  // volume
  const [vol, setVol] = useState(volume);
  const maxTick = Math.max(1,ticks) || 1;
  const tick = Math.max(0,vol * maxTick);
  const percent = `${Math.round(vol * 100)}%`;
  // dial angle
  const minAngle = -135;
  const maxAngle = 135;
  const angleSpan = maxAngle - minAngle;
  const startAngle = minAngle + vol * angleSpan;
  const [angle, setAngle] = useState(startAngle);
  // dots
  const dotSectorAngle = angleSpan / maxTick;
  const dotSectorAngleOffset = -angleSpan / 2 + dotSectorAngle / 2;
  const dotTickOffset = 0.5;
  const dotFillArray: boolean[] = [];

  for (let t = 0; t < ticks; ++t) {
    // add dots for valid tick counts only
    dotFillArray.push(t < tick - dotTickOffset);
  }
  // set the volume
  useEffect(() => {
    setVol((angle - minAngle) / angleSpan);
  }, [angle]);
  // initiate the draggable
  useEffect(() => {
    Draggable.create(dialRef.current, {
      type: "rotation",
      bounds: {
        minRotation: minAngle, 
        maxRotation: maxAngle
      },
      onDrag: function() {
        setAngle(this.rotation);
      }
    });
  }, []);
  // run a transition when adjusting using arrow keys
  useGSAP(() => {
    if (isKeyDown) {
      gsap.to(dialRef.current, {
        rotation: angle,
        duration: 0.15
      });
    }
  }, [angle]);
  // starting angle
  useGSAP(() => {
    gsap.to(dialRef.current, {
      rotation: startAngle,
      duration: 0
    });
  }, []);

  function keyboardAction(e: React.KeyboardEvent<HTMLButtonElement>) {
    const up = e.code === "ArrowUp" || e.code === "ArrowRight";
    const down = e.code === "ArrowDown" || e.code === "ArrowLeft";

    if (up || down) {
      e.preventDefault();
      setIsKeydown(true);
    }
    if (up) {
      setAngle(minAngle + Math.min(tick + 1,maxTick) / maxTick * angleSpan);
    } else if (down) {
      setAngle(minAngle + Math.max(0,tick - 1) / maxTick * angleSpan);
    }
  }

  return (
    <div className={rootClass}>
      <div className="volume__control">
        {dotFillArray.map((l,i) => {
          const angle = dotSectorAngle * i + dotSectorAngleOffset;
          return (<VolumeDialDot key={i} angle={angle} filled={l} />)
        })}
        <div className="volume__dial-wrap">
          <button
            className="volume__dial"
            type="button"
            ref={dialRef}
            onKeyDown={keyboardAction}
            onKeyUp={() => setIsKeydown(false)}
            aria-description={percent}
          >
            <span className="volume__dial-label">{label}</span>
          </button>
        </div>
      </div>
      <div className="volume__content">
        {children}
      </div>
    </div>
  );
} 