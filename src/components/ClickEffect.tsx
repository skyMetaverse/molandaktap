'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ClickPoint {
    id: number
    x: number
    y: number
}

export default function ClickEffect() {
    const [points, setPoints] = useState<ClickPoint[]>([])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const button = document.querySelector('#click-button')
            if (button && button.contains(e.target as Node)) {
                const rect = button.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                setPoints(prev => [...prev, {
                    id: Date.now(),
                    x,
                    y
                }])

                setTimeout(() => {
                    setPoints(prev => prev.filter(p => p.id !== Date.now()))
                }, 800)
            }
        }

        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none">
            <AnimatePresence>
                {points.map(point => (
                    <motion.div
                        key={point.id}
                        initial={{
                            opacity: 0.8,
                            scale: 1,
                            x: point.x,
                            y: point.y
                        }}
                        animate={{
                            opacity: [0.8, 0.8, 0],
                            scale: 1,
                            y: point.y - 150
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut"
                        }}
                        className="absolute text-3xl font-bold"
                        style={{
                            color: '#5FEDDF',
                            WebkitTextStroke: '1px #836EF9',
                            textShadow: '0 0 10px rgba(131, 110, 249, 0.5)'
                        }}
                    >
                        +1
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
} 