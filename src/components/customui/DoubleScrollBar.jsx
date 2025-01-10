/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState, useRef } from "react";
import "./temp.css";

const DoubleScrollBarComponent = ({ min, max, onChange,reset}) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);

    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value);
            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);
            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    useEffect(() => {
            setMinVal(min);
            setMaxVal(max);
    }, [max, min, reset]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-center w-full relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    ref={minValRef}
                    onChange={(event) => {
                        const value = Math.min(+event.target.value, maxVal - 1);
                        setMinVal(value);
                        event.target.value = value.toString();
                    }}
                    className="thumb z-[3]"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    ref={maxValRef}
                    onChange={(event) => {
                        const value = Math.max(+event.target.value, minVal + 1);
                        setMaxVal(value);
                        event.target.value = value.toString();
                    }}
                    className="thumb z-[4]"
                />

                {/* Track container */}
                <div className="track w-full">
                    <div ref={range} className="absolute bg-color4 h-[6px] rounded-[3px] border border-color4"></div>
                </div>
            </div>
            <div className="flex justify-between w-full mt-2 px-[2px]">
                <span className="text-color5 text-lg">{min}</span>
                <span className="text-color5 text-lg">{max}</span>
            </div>
        </div>
    );
};

const DoubleScrollBar = React.memo(DoubleScrollBarComponent);
DoubleScrollBar.displayName = "DoubleScrollBar";

export { DoubleScrollBar };
