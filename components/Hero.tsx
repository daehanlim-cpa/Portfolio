"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="w-full min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                    {/* Profile Image */}
                    <div className="order-2 md:order-1">
                        <div className="relative w-full aspect-square max-w-md mx-auto rounded-2xl overflow-hidden">
                            <Image
                                src="/images/profile.jpg"
                                alt="Daehan Lim"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-6 order-1 md:order-2">
                        <h1 className="text-4xl md:text-5xl font-light">Daehan Lim</h1>

                        <div className="space-y-4">
                            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                I work at the intersection of product thinking and engineering execution.
                            </p>

                            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                I specialize in taking ambiguous business problems and translating them into scalable data and AI systems that teams can actually build, operate, and evolve.
                            </p>

                            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                I have led end-to-end delivery of data platforms, analytics products, and compliance-driven systems, partnering closely with executives, product owners, and engineering teams.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="/projects"
                                className="px-8 py-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium text-center"
                            >
                                View Projects
                            </Link>
                            <Link
                                href="/resume"
                                className="px-8 py-4 border border-gray-300 text-gray-900 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-center"
                            >
                                Resume
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
