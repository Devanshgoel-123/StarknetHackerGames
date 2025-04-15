"use client"

import type { Contact } from "..";
import { Card, CardContent } from "@mui/material";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { Edit, Trash2, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import "./styles.scss";
import Image from "next/image";
interface ContactsListProps {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
}

export function ContactsList({ contacts, onEdit, onDelete }: ContactsListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, contactId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(contactId);
    
    // Reset the copied status after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  }
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  const getChainInfo = (chain: string) => {
    switch (chain.toLowerCase()) {
      case "ethereum":
        return { icon: "🔷", className: "chain-ethereum" };
      case "aptos":
        return { icon: "🔵", className: "chain-aptos" };
      case "solana":
        return { icon: "🟣", className: "chain-solana" };
      default:
        return { icon: "🔗", className: "chain-default" };
    }
  }
  
  if (contacts.length === 0) {
    return (
      <div className="empty-contacts">
        <p>No contacts found</p>
        <p className="empty-contacts-subtitle">Add your first contact to get started</p>
      </div>
    );
  }
  
  return (
    <div className="contacts-grid">
      {contacts.map((contact) => {
        const chainInfo = getChainInfo(contact.chain);
        const isCopied = copiedId === contact.id;
        
        return (
          <Card key={contact.id} className="contact-card">
            <CardContent className="contact-card-content">
              <div className="contact-header">
                <div className="contact-name-section">
                  <Badge className={`chain-badge ${chainInfo.className}`}>
                    <Image src={"https://assets.coingecko.com/coins/images/26433/small/starknet.png"} height={30} width={30} alt="Strklogo"/>
                  </Badge>
                  <h3 className="contact-name">{contact.name}</h3>
                </div>
                <div className="contact-actions">
                  <Tooltip title="Edit contact">
                    <IconButton 
                      className="edit-button"
                      onClick={() => onEdit(contact)}
                      size="small"
                    >
                      <Edit className="action-icon" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete contact">
                    <IconButton
                      className="delete-button"
                      onClick={() => onDelete(contact.id)}
                      size="small"
                    >
                      <Trash2 className="action-icon" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              
              <div className="address-container">
                <span className="wallet-address">{truncateAddress(contact.walletAddress)}</span>
                <Tooltip title={isCopied ? "Copied!" : "Copy address"}>
                  <div
                    className="copy-button"
                    onClick={() => copyToClipboard(contact.walletAddress, contact.id)}      
                  >
                    {isCopied ? (
                      <CheckCircle className="copy-success" />
                    ) : (
                      <Copy className="copy-icon" />
                    )}
                  </div>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}