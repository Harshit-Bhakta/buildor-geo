"use client";

import React from "react";

// YouTube Video Card Component
const YouTubeCard = ({ videoId, title, description }) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newWindow = window.open(videoUrl, '_blank');
        if (!newWindow) {
            window.location.href = videoUrl;
        }
    };

    return (
        <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="group block relative rounded-2xl cursor-pointer hover:scale-[1.02] transition-all duration-300 w-full max-w-[420px] border-gradient-animated"
        >
            {/* Animated glowing border effect */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 via-pink-500 to-cyan-400 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 animate-gradient-xy"></div>
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 via-pink-500 to-cyan-400 rounded-2xl animate-gradient-xy"></div>
            
            {/* Card content with dark background */}
            <div className="relative bg-[#0a0118] rounded-2xl overflow-hidden h-full">
                <div className="relative w-full aspect-video">
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all">
                        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                            <svg
                                className="w-10 h-10 text-white ml-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gradient-to-b from-[#0a0118] to-[#1a0a2e]">
                    <h1 className="text-xl font-bold text-white mb-3">
                        {title}
                    </h1>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes gradient-xy {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                
                .animate-gradient-xy {
                    background-size: 300% 300%;
                    animation: gradient-xy 6s ease infinite;
                }
            `}</style>
        </a>
    );
};

// Main Videos Component
const Videos = () => {
    const videos = [
        {
            videoId: "NHolzMgaqwE",
            title: "Introduction to QGIS - Complete Beginner's Guide",
            description: "Learn QGIS from scratch with this comprehensive tutorial covering interface, tools, and basic mapping for geospatial analysis."
        },
        {
            videoId: "iCxDnjye3gU",
            title: "Google Earth Pro Tutorial",
            description: "Master Google Earth Pro for creating maps, importing shapefiles, visualizing topography, and geospatial data conversions."
        },
        {
            videoId: "WmobNBnN1lc",
            title: "Python for Geospatial Analysis with GeoPandas",
            description: "Learn to use Python GeoPandas for GIS analysis, automating geoprocessing tasks, and creating density maps."
        }
    ];

    return (
        <div
            className="flex flex-col items-center justify-center py-20"
            id="videos"
        >
            <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
                Geospatial Learning Resources
            </h1>
            <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10 justify-center items-center md:items-stretch relative z-[30]">
                {videos.map((video, index) => (
                    <YouTubeCard
                        key={index}
                        videoId={video.videoId}
                        title={video.title}
                        description={video.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default Videos;