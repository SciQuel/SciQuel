"use client";
import React from 'react';
import { useState } from 'react';
import TeamMemberButton from '../../components/TeamMemberButton/TeamMemberButton';

const teamMembers = [
  { 
    name: 'Mary Wang', 
    title: 'UX Designer',
    history: 'Mary has been with SciQuel for 5 years and has a background in cognitive psychology.',
    email: 'mary.wang@sciquel.com',
    phone: '(555) 123-4567'
  },
  { 
    name: 'John Deer', 
    title: 'Writer',
    history: 'John joined SciQuel 3 years ago after completing his PhD in Biochemistry.',
    email: 'john.deer@sciquel.com',
    phone: '(555) 987-6543'
  },
  { 
    name: 'Mary Wang', 
    title: 'UX Designer',
    history: 'Mary has been with SciQuel for 5 years and has a background in cognitive psychology.',
    email: 'mary.wang@sciquel.com',
    phone: '(555) 123-4567'
  },
  { 
    name: 'John Deer', 
    title: 'Writer',
    history: 'John joined SciQuel 3 years ago after completing his PhD in Biochemistry.',
    email: 'john.deer@sciquel.com',
    phone: '(555) 987-6543'
  },
  
  { 
    name: 'Mary Wang', 
    title: 'UX Designer',
    history: 'Mary has been with SciQuel for 5 years and has a background in cognitive psychology.',
    email: 'mary.wang@sciquel.com',
    phone: '(555) 123-4567'
  },
  { 
    name: 'John Deer', 
    title: 'Writer',
    history: 'John joined SciQuel 3 years ago after completing his PhD in Biochemistry.',
    email: 'john.deer@sciquel.com',
    phone: '(555) 987-6543'
  },
  
  { 
    name: 'Mary Wang', 
    title: 'UX Designer',
    history: 'Mary has been with SciQuel for 5 years and has a background in cognitive psychology.',
    email: 'mary.wang@sciquel.com',
    phone: '(555) 123-4567'
  },
  { 
    name: 'John Deer', 
    title: 'Writer',
    history: 'John joined SciQuel 3 years ago after completing his PhD in Biochemistry.',
    email: 'john.deer@sciquel.com',
    phone: '(555) 987-6543'
  },
  
  { 
    name: 'Mary Wang', 
    title: 'UX Designer',
    history: 'Mary has been with SciQuel for 5 years and has a background in cognitive psychology.',
    email: 'mary.wang@sciquel.com',
    phone: '(555) 123-4567'
  },
  { 
    name: 'John Deer', 
    title: 'Writer',
    history: 'John joined SciQuel 3 years ago after completing his PhD in Biochemistry.',
    email: 'john.deer@sciquel.com',
    phone: '(555) 987-6543'
  },
  
  
];

export default function About() {
    const [selectedMember, setSelectedMember] = useState<number | null>(null);
  
    return (
      <div className="font-sourceSerif4">
        <div className="flex flex-col justify-center items-center min-h-screen p-5 box-border">
          <h1 className="text-4xl mb-1 text-center">Behind the Science</h1>
          <div className="w-full max-w-[600px] h-0.5 bg-black my-4"></div>
          <h2 className="text-3xl mt-1 mb-20 text-center">Meet the SciQuel Team</h2>
          <div className="max-w-[1200px] w-full">
            <div className="grid gap-5 justify-center grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
              {teamMembers.map((member, index) => (
                <div 
                  key={`${member.name}-${index}`} 
                  onClick={() => setSelectedMember(index)}
                  className={`cursor-pointer ${selectedMember === index ? 'bg-gray-200' : ''}`}
                >
                  <TeamMemberButton
                    {...member}
                    index={index}
                    elementNumber={index + 3}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }