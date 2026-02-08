import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Logo = ({ className }: { className?: string }) => {
    return (
        <Link href="/">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className={className} />
        </Link>
    )
}

export default Logo