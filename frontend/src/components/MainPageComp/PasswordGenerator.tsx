"use client";
import { useEffect, useState } from 'react'
import { PasswordDisplay } from './PasswordDisplay';
import { StrengthIndicator } from './StrengthIndicator';
import { PasswordCustomizer } from './PasswordCustomizer';

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let charset = "";
    if (options.uppercase) charset += uppercase;
    if (options.lowercase) charset += lowercase;
    if (options.numbers) charset += numbers;
    if (options.symbols) charset += symbols;

    if (charset === "") {
      setPassword("");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++){
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
  }

  const calculateStrength = (): "weak" | "average" | "strong" => {
    let score = 0;

    //? Length scoring
    if (length >= 12) score += 2;
    else if (length >= 8) score += 1;

    //? Character variety scoring
    if (options.uppercase) score += 1;
    if (options.lowercase) score += 1;
    if (options.numbers) score += 1;
    if (options.symbols) score += 1;

    if (score <= 3) return "weak";
    if (score <= 5) return "average";

    return "strong"
  }

  const handleCopy = () => {
    if (password) navigator.clipboard.writeText(password);
  }

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  }

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  return (
    <div className="w-full max-w-md flex flex-col gap-6 p-6">
      <PasswordDisplay
        password={password}
        onRegenerate={generatePassword}
        onCopy={handleCopy}
      />

      <StrengthIndicator strength={calculateStrength()} />

      <PasswordCustomizer
        length={length}
        onLengthChange={(value) => setLength(value[0])}
        options={options}
        onOptionChange={handleOptionChange}
      />
    </div>
  )
}

export default PasswordGenerator