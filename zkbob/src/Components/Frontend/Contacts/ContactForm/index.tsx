"use client"

import { useState } from "react"
import type React from "react"
import { Contact } from ".."
import { Button, TextField as Input, Select, MenuItem } from "@mui/material"
import "./styles.scss";

interface ContactFormProps {
  onSubmit: (contact: Contact | Omit<Contact, "id">) => void
  onCancel: () => void
  initialData?: Contact | null
}

export function ContactForm({ onSubmit, onCancel, initialData }: ContactFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [walletAddress, setWalletAddress] = useState(initialData?.walletAddress || "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [chain, setChain] = useState(initialData?.chain || "ethereum")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const contactData = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name,
      walletAddress,
      tags,
      chain,
    }

    onSubmit(contactData as Contact)
  }

  return (
    <div className="form-container">
      <h2 className="form-heading">{initialData ? "Edit Contact" : "Add New Contact"}</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter contact name"
            variant="outlined"
            required
            fullWidth
          />
        </div>

        <div className="form-field">
          <label htmlFor="chain">Chain</label>
          <Select
            id="chain"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            fullWidth
          >
            <MenuItem value="starknet">Starknet</MenuItem>
          </Select>
        </div>

        <div className="form-field full-width">
          <label htmlFor="walletAddress">Wallet Address</label>
          <Input
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter wallet address"
            variant="outlined"
            required
            fullWidth
          />
        </div>
        <div className="form-actions">
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" className="submit-btn" size="small">
            {initialData ? "Save Changes" : "Add Contact"}
          </Button>
        </div>
      </form>
    </div>
  )
}