"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"
import { Contact } from ".."
import { Button, TextField as Input, Select, MenuItem, IconButton, Tooltip } from "@mui/material"
import { BsMic, BsMicMute } from "react-icons/bs"
import "./styles.scss";

interface ContactFormProps {
  onSubmit: (contact: Contact | Omit<Contact, "id">) => void
  onCancel: () => void
  initialData?: Contact | null
}

export function ContactForm({ onSubmit, onCancel, initialData }: ContactFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [walletAddress, setWalletAddress] = useState(initialData?.address || "")
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const walletInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setSpeechSupported(supported);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const contactData = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name,
      address:walletAddress,
    }

    onSubmit(contactData as Contact)
  }

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };
  
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognition = new (SpeechRecognition as any)();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    let finalTranscript = '';
    
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          const formattedAddress = finalTranscript.replace(/\s+/g, '');
          setWalletAddress(formattedAddress);
        } else {
          interimTranscript += transcript;
          setWalletAddress(interimTranscript);
        }
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.start();
    setIsListening(true);
  };
  
  const stopSpeechRecognition = () => {
    setIsListening(false);
  };

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
            className="dark-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="chain">Chain</label>
          <Select
            id="chain"
            value={"starknet"}
            fullWidth
            className="dark-select"
          >
            <MenuItem value="starknet">Starknet</MenuItem>
          </Select>
        </div>

        <div className="form-field full-width wallet-address-field">
          <label htmlFor="walletAddress">Wallet Address</label>
          <div className="input-with-button">
            <Input
              id="walletAddress"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address"
              variant="outlined"
              required
              fullWidth
              className={`dark-input ${isListening ? 'listening' : ''}`}
              inputRef={walletInputRef}
            />
            {speechSupported && (
              <Tooltip title={isListening ? "Stop dictating" : "Dictate wallet address"}>
                <IconButton 
                  onClick={toggleSpeechRecognition}
                  className={`mic-button ${isListening ? 'active' : ''}`}
                  size="small"
                >
                  {isListening ? <BsMicMute /> : <BsMic />}
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <Button variant="outlined" onClick={onCancel} className="cancel-btn">
            Cancel
          </Button>
          <Button type="submit" variant="contained" className="submit-btn">
            {initialData ? "Save Changes" : "Add Contact"}
          </Button>
        </div>
      </form>
    </div>
  )
}