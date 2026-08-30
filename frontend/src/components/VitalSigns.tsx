"use client";
import React from 'react';
import { Activity, Battery, Calendar, Heart } from 'lucide-react';

interface VitalsProps {
  energy: number;
  age: number;
  isAlive: boolean;
}

export default function VitalSigns({ energy, age, isAlive }: VitalsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900 text-white rounded-xl">
      <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
        <Battery className={energy < 20 ? "text-red-500" : "text-green-500"} />
        <div>
          <p className="text-xs text-gray-400">Energy</p>
          <p className="font-bold">{energy}%</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
        <Calendar className="text-blue-400" />
        <div>
          <p className="text-xs text-gray-400">Age</p>
          <p className="font-bold">{age} days</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
        <Heart className={isAlive ? "text-green-500" : "text-red-500"} />
        <div>
          <p className="text-xs text-gray-400">Status</p>
          <p className="font-bold">{isAlive ? "Alive" : "Dead"}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
        <Activity className="text-yellow-400" />
        <div>
          <p className="text-xs text-gray-400">Vitality</p>
          <p className="font-bold">Stable</p>
        </div>
      </div>
    </div>
  );
}
