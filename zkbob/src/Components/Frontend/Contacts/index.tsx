"use client"

import { useEffect, useState } from "react"
import { ContactsList } from "./ContactsList"
import { ContactForm } from "./ContactForm"
import { SearchBar } from "./SearchBar"
import { PlusCircle } from "lucide-react"
import axios from "axios";
import "./styles.scss";
import { BACKEND_URL } from "@/Components/Backend/Common/Constants"
import { useShallow } from "zustand/react/shallow"
import { useAgentStore } from "@/store/agent-store"
export interface Contact {
    id: string;
    name: string;
    walletAddress: string;
    userId:string;
  }
  


export function ContactWrapper() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddContact, setShowAddContact] = useState(false);
  const {
    agentWalletAddress
  }=useAgentStore(useShallow((state)=>({
    agentWalletAddress:state.agentWalletAddress
  })))
  const [contacts, setContacts] = useState<Contact[]>([])
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  useEffect(()=>{
    const fetchUserContacts=async ()=>{
      const result=await axios.get(`${BACKEND_URL}/userContact/contacts`,{
        params:{
          userAddress:agentWalletAddress
        }
      }) 
      console.log(result.data)
      const contacts=result.data.result
      setContacts(contacts)
    }
    fetchUserContacts();
  },[])

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
