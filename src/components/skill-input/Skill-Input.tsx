'use client'

import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface SkillsInputProps {
    value: string[] // It expects an array ['React', 'Node']
    onChange: (value: string[]) => void
}

export function SkillsInput({ value = [], onChange }: SkillsInputProps) {
    const [inputValue, setInputValue] = useState('')

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()

            const skill = inputValue.trim()

            // Validation: specific length, not empty, not duplicate
            if (skill && !value.includes(skill)) {
                const newSkills = [...value, skill]
                onChange(newSkills) // Send update to parent form
                setInputValue('') // Clear input
            }
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            // Remove last tag if input is empty and user hits Backspace
            const newSkills = value.slice(0, -1)
            onChange(newSkills)
        }
    }

    const removeSkill = (skillToRemove: string) => {
        const newSkills = value.filter(skill => skill !== skillToRemove)
        onChange(newSkills)
    }

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent min-h-[42px]">

                {/* Render the Chips */}
                {value.map((skill) => (
                    <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-black"
                    >
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-red-600 cursor-pointer focus:outline-none"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                {/* The Typing Input */}
                {value?.length < 8 && <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 outline-none bg-transparent min-w-[120px] text-sm py-1"
                    placeholder={value.length === 0 ? "Type skill & hit Enter..." : ""}
                    maxLength={40}
                />}
            </div>
            <p className="text-xs text-gray-400 mt-1">Press ⏎ Enter or comma to add a tag</p>
        </div>
    )
}