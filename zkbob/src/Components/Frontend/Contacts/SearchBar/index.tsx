"use client"
import "./styles.scss";
import { Input } from "@mui/material"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="searchbar-container">
      <Search className="searchbar-icon" />
      <Input
        type="text"
        placeholder="Search by name, tag, or address..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="searchbar-input"
        disableUnderline
        fullWidth
      />
    </div>
  )
}