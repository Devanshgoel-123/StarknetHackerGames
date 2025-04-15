"use client"

import { useState } from "react"
import { ContactsList } from "./ContactsList"
import { ContactForm } from "./ContactForm"
import { SearchBar } from "./SearchBar"
import { PlusCircle } from "lucide-react"
import { Button } from "@mui/material";
import "./styles.scss";
export interface Contact {
    id: string
    name: string
    walletAddress: string
    tags: string[]
    chain: string
  }
  


export function ContactWrapper() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddContact, setShowAddContact] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Zoro",
      walletAddress: "0xabc123def456789abcdef123456789abcdef1234",
      tags: ["friend", "aptos"],
      chain: "aptos",
    },
    {
      id: "2",
      name: "Luffy",
      walletAddress: "0x9876543210abcdef9876543210abcdef98765432",
      tags: ["developer", "ethereum"],
      chain: "ethereum",
    },
    {
      id: "3",
      name: "Nami",
      walletAddress: "0x5432109876abcdef5432109876abcdef54321098",
      tags: ["frequent sender", "solana"],
      chain: "solana",
    },
  ])
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const handleAddContact = (contact: Omit<Contact, "id">) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
    }
    setContacts([...contacts, newContact])
    setShowAddContact(false)
  }

  const handleEditContact = (contact: Contact) => {
    setContacts(contacts.map((c) => (c.id === contact.id ? contact : c)))
    setEditingContact(null)
  }

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
      contact.walletAddress.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="contact-wrapper">
      <div className="contact-header">
        <div className="contact-header-top">
          <h2 className="contact-title">Contacts</h2>
          <div
            onClick={() => {
              setEditingContact(null)
              setShowAddContact(true)
            }}
            className="add-contact-button"
          >
            <PlusCircle className="add-icon" />
            Add Contact
          </div>
        </div>
        <div className="search-bar-container">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="contact-body">
        {showAddContact || editingContact ? (
          <ContactForm
            onSubmit={(contact) => {
              if (editingContact) {
                handleEditContact(contact as Contact)
              } else {
                handleAddContact(contact as Omit<Contact, "id">)
              }
            }}
            onCancel={() => {
              setShowAddContact(false)
              setEditingContact(null)
            }}
            initialData={editingContact}
          />
        ) : (
          <ContactsList contacts={filteredContacts} onEdit={setEditingContact} onDelete={handleDeleteContact} />
        )}
      </div>
    </div>
  )
}
