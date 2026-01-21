import Link from "next/link";

export default function Footer() {
    return (
        <footer id="contact" className="w-full border-t border-gray-200 bg-white">
            <div className="max-w-content mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-normal">Daehan Lim, CPA</h3>
                        <a
                            href="mailto:daehanlim1@gmail.com"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            daehanlim1@gmail.com
                        </a>
                    </div>

                    <div className="flex gap-6">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Daehan Lim. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
