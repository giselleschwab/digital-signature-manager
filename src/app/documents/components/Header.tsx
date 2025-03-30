import React from 'react';
import { SignOutButton } from '@/app/login/components/SignOutButton';

interface HeaderProps {
    userName: string; // Nome do usuário será passado como prop
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
    return (
        <header className="flex justify-between items-center p-4 bg-[#383838] text-white">
            <div>
                <p className="text-lg">Olá, {userName}!</p>
            </div>

            <div>
                <SignOutButton />
            </div>
        </header>
    );
}

export default Header;
