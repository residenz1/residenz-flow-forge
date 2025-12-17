export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string | null
          created_at: string | null
          district: string | null
          id: string
          instructions: string | null
          is_default: boolean | null
          location: unknown
          street_address: string
          unit_id: string | null
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          district?: string | null
          id?: string
          instructions?: string | null
          is_default?: boolean | null
          location?: unknown
          street_address: string
          unit_id?: string | null
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string | null
          district?: string | null
          id?: string
          instructions?: string | null
          is_default?: boolean | null
          location?: unknown
          street_address?: string
          unit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_financial_ops: {
        Row: {
          amount: number | null
          booking_id: string | null
          created_at: string | null
          id: number
          op: string | null
          tenant_id: string | null
        }
        Insert: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string | null
          id?: never
          op?: string | null
          tenant_id?: string | null
        }
        Update: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string | null
          id?: never
          op?: string | null
          tenant_id?: string | null
        }
        Relationships: []
      }
      audit_user_bootstrap: {
        Row: {
          created_at: string | null
          id: number
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          tenant_id?: string
          user_id?: string
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_holder_name: string
          account_number_encrypted: string
          account_type: Database["public"]["Enums"]["account_type"] | null
          bank_name: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          user_id: string
        }
        Insert: {
          account_holder_name: string
          account_number_encrypted: string
          account_type?: Database["public"]["Enums"]["account_type"] | null
          bank_name: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          user_id: string
        }
        Update: {
          account_holder_name?: string
          account_number_encrypted?: string
          account_type?: Database["public"]["Enums"]["account_type"] | null
          bank_name?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_tasks: {
        Row: {
          booking_id: string
          completed_at: string | null
          created_at: string | null
          description: string
          id: string
          is_completed: boolean | null
          is_critical: boolean | null
        }
        Insert: {
          booking_id: string
          completed_at?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_completed?: boolean | null
          is_critical?: boolean | null
        }
        Update: {
          booking_id?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_completed?: boolean | null
          is_critical?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_booking_settlement_status"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "booking_tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings_financials"
            referencedColumns: ["booking_id"]
          },
        ]
      }
      bookings: {
        Row: {
          address_id: string | null
          agreed_payout_amount: number | null
          booking_type: Database["public"]["Enums"]["booking_type"]
          building_tenant_id: string | null
          check_in_at: string | null
          check_in_location: unknown
          check_in_selfie_url: string | null
          check_out_at: string | null
          client_id: string
          client_tenant_id: string | null
          commission_amount: number | null
          common_area_id: string | null
          country_code: string | null
          created_at: string | null
          currency: string | null
          id: string
          provider_payout_amount: number | null
          provider_tenant_id: string | null
          resi_id: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["booking_status"] | null
          subscription_id: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          address_id?: string | null
          agreed_payout_amount?: number | null
          booking_type: Database["public"]["Enums"]["booking_type"]
          building_tenant_id?: string | null
          check_in_at?: string | null
          check_in_location?: unknown
          check_in_selfie_url?: string | null
          check_out_at?: string | null
          client_id: string
          client_tenant_id?: string | null
          commission_amount?: number | null
          common_area_id?: string | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider_payout_amount?: number | null
          provider_tenant_id?: string | null
          resi_id?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          subscription_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          address_id?: string | null
          agreed_payout_amount?: number | null
          booking_type?: Database["public"]["Enums"]["booking_type"]
          building_tenant_id?: string | null
          check_in_at?: string | null
          check_in_location?: unknown
          check_in_selfie_url?: string | null
          check_out_at?: string | null
          client_id?: string
          client_tenant_id?: string | null
          commission_amount?: number | null
          common_area_id?: string | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider_payout_amount?: number | null
          provider_tenant_id?: string | null
          resi_id?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          subscription_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_building_tenant_id_fkey"
            columns: ["building_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_client_tenant_id_fkey"
            columns: ["client_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_common_area_id_fkey"
            columns: ["common_area_id"]
            isOneToOne: false
            referencedRelation: "common_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_tenant_id_fkey"
            columns: ["provider_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_resi_id_fkey"
            columns: ["resi_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          access_instructions: Json | null
          address: string
          city: string | null
          created_at: string | null
          district: string | null
          has_common_areas: boolean | null
          id: string
          landlord_id: string
          location: unknown
          name: string
          partnership_start_date: string | null
          partnership_status:
            | Database["public"]["Enums"]["partnership_status"]
            | null
          total_units: number | null
          updated_at: string | null
        }
        Insert: {
          access_instructions?: Json | null
          address: string
          city?: string | null
          created_at?: string | null
          district?: string | null
          has_common_areas?: boolean | null
          id?: string
          landlord_id: string
          location?: unknown
          name: string
          partnership_start_date?: string | null
          partnership_status?:
            | Database["public"]["Enums"]["partnership_status"]
            | null
          total_units?: number | null
          updated_at?: string | null
        }
        Update: {
          access_instructions?: Json | null
          address?: string
          city?: string | null
          created_at?: string | null
          district?: string | null
          has_common_areas?: boolean | null
          id?: string
          landlord_id?: string
          location?: unknown
          name?: string
          partnership_start_date?: string | null
          partnership_status?:
            | Database["public"]["Enums"]["partnership_status"]
            | null
          total_units?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buildings_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          booking_id: string
          created_at: string | null
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_booking_settlement_status"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "chat_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings_financials"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      common_areas: {
        Row: {
          agreed_price_per_service: number | null
          building_id: string
          cleaning_frequency:
            | Database["public"]["Enums"]["cleaning_frequency"]
            | null
          created_at: string | null
          estimated_sqm: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          agreed_price_per_service?: number | null
          building_id: string
          cleaning_frequency?:
            | Database["public"]["Enums"]["cleaning_frequency"]
            | null
          created_at?: string | null
          estimated_sqm?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          agreed_price_per_service?: number | null
          building_id?: string
          cleaning_frequency?:
            | Database["public"]["Enums"]["cleaning_frequency"]
            | null
          created_at?: string | null
          estimated_sqm?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "common_areas_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_idempotency: {
        Row: {
          amount: number | null
          booking_id: string | null
          created_at: string | null
          idempotency_key: string
        }
        Insert: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string | null
          idempotency_key: string
        }
        Update: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string | null
          idempotency_key?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          booking_id: string | null
          building_id: string | null
          category: Database["public"]["Enums"]["incident_category"]
          created_at: string | null
          description: string
          id: string
          priority: Database["public"]["Enums"]["incident_priority"] | null
          reporter_id: string
          resolution_notes: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["incident_status"] | null
        }
        Insert: {
          booking_id?: string | null
          building_id?: string | null
          category: Database["public"]["Enums"]["incident_category"]
          created_at?: string | null
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["incident_priority"] | null
          reporter_id: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["incident_status"] | null
        }
        Update: {
          booking_id?: string | null
          building_id?: string | null
          category?: Database["public"]["Enums"]["incident_category"]
          created_at?: string | null
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["incident_priority"] | null
          reporter_id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["incident_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_booking_settlement_status"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "incidents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings_financials"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "incidents_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          booking_id: string | null
          created_at: string | null
          description: string
          id: string
          invoice_id: string
          quantity: number | null
          total: number
          unit_price: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          invoice_id: string
          quantity?: number | null
          total: number
          unit_price: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number | null
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_booking_settlement_status"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "invoice_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings_financials"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          billing_period_end: string
          billing_period_start: string
          building_id: string
          created_at: string | null
          discount: number | null
          due_date: string
          id: string
          landlord_id: string
          pdf_url: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          total: number
        }
        Insert: {
          billing_period_end: string
          billing_period_start: string
          building_id: string
          created_at?: string | null
          discount?: number | null
          due_date: string
          id?: string
          landlord_id: string
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          total: number
        }
        Update: {
          billing_period_end?: string
          billing_period_start?: string
          building_id?: string
          created_at?: string | null
          discount?: number | null
          due_date?: string
          id?: string
          landlord_id?: string
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_entries: {
        Row: {
          amount_cents: number
          booking_id: string | null
          created_at: string
          description: string | null
          entry_type: string
          id: string
          idempotency_key: string | null
          metadata: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          entry_type: string
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          entry_type?: string
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_booking_settlement_status"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "ledger_entries_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings_financials"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "ledger_entries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          interest_rate: number
          monthly_installment: number
          principal_amount: number
          remaining_balance: number
          resi_id: string
          start_date: string
          status: Database["public"]["Enums"]["loan_status"] | null
          term_months: number
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          interest_rate: number
          monthly_installment: number
          principal_amount: number
          remaining_balance: number
          resi_id: string
          start_date: string
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_months: number
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          interest_rate?: number
          monthly_installment?: number
          principal_amount?: number
          remaining_balance?: number
          resi_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_months?: number
        }
        Relationships: [
          {
            foreignKeyName: "loans_resi_id_fkey"
            columns: ["resi_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_jobs: {
        Row: {
          amount_cents: number
          booking_id: string
          created_at: string
          currency: string
          destination_account: Json
          id: string
          idempotency_key: string
          last_attempt_at: string | null
          last_error: Json | null
          next_attempt_at: string | null
          processing_worker_id: string | null
          provider_id: string
          retry_count: number
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          booking_id: string
          created_at?: string
          currency?: string
          destination_account: Json
          id?: string
          idempotency_key: string
          last_attempt_at?: string | null
          last_error?: Json | null
          next_attempt_at?: string | null
          processing_worker_id?: string | null
          provider_id: string
          retry_count?: number
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          booking_id?: string
          created_at?: string
          currency?: string
          destination_account?: Json
          id?: string
          idempotency_key?: string
          last_attempt_at?: string | null
          last_error?: Json | null
          next_attempt_at?: string | null
          processing_worker_id?: string | null
          provider_id?: string
          retry_count?: number
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_jobs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_jobs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          base_price: number
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          size_bedrooms: number | null
          visits_per_month: number
        }
        Insert: {
          base_price: number
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          size_bedrooms?: number | null
          visits_per_month: number
        }
        Update: {
          base_price?: number
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          plan_type?: Database["public"]["Enums"]["plan_type"]
          size_bedrooms?: number | null
          visits_per_month?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      queue_events: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          id: string
          payload: Json
          retry_count: number | null
          status: string
          topic: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          payload: Json
          retry_count?: number | null
          status?: string
          topic?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          payload?: Json
          retry_count?: number | null
          status?: string
          topic?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          id: string
          rated_id: string
          rater_id: string
          stars: number
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rated_id: string
          rater_id: string
          stars: number
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rated_id?: string
          rater_id?: string
          stars?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_booking_settlement_status"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "ratings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings_financials"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "ratings_rated_id_fkey"
            columns: ["rated_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reconciliation_checkpoint: {
        Row: {
          job_name: string
          last_user_id: string | null
          updated_at: string | null
        }
        Insert: {
          job_name: string
          last_user_id?: string | null
          updated_at?: string | null
        }
        Update: {
          job_name?: string
          last_user_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          commission_for_owner: number
          created_at: string | null
          discount_for_referred: number
          id: string
          is_active: boolean | null
          owner_id: string
          times_used: number | null
        }
        Insert: {
          code: string
          commission_for_owner: number
          created_at?: string | null
          discount_for_referred: number
          id?: string
          is_active?: boolean | null
          owner_id: string
          times_used?: number | null
        }
        Update: {
          code?: string
          commission_for_owner?: number
          created_at?: string | null
          discount_for_referred?: number
          id?: string
          is_active?: boolean | null
          owner_id?: string
          times_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          commission_earned: number | null
          created_at: string | null
          id: string
          referral_code_id: string
          referred_subscription_id: string | null
          referred_user_id: string
          status: Database["public"]["Enums"]["referral_status"] | null
        }
        Insert: {
          commission_earned?: number | null
          created_at?: string | null
          id?: string
          referral_code_id: string
          referred_subscription_id?: string | null
          referred_user_id: string
          status?: Database["public"]["Enums"]["referral_status"] | null
        }
        Update: {
          commission_earned?: number | null
          created_at?: string | null
          id?: string
          referral_code_id?: string
          referred_subscription_id?: string | null
          referred_user_id?: string
          status?: Database["public"]["Enums"]["referral_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_subscription_id_fkey"
            columns: ["referred_subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      score_history: {
        Row: {
          change_reason: string | null
          created_at: string | null
          id: string
          new_score: number | null
          old_score: number | null
          score_id: string
        }
        Insert: {
          change_reason?: string | null
          created_at?: string | null
          id?: string
          new_score?: number | null
          old_score?: number | null
          score_id: string
        }
        Update: {
          change_reason?: string | null
          created_at?: string | null
          id?: string
          new_score?: number | null
          old_score?: number | null
          score_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "score_history_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "scores"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          current_score: number | null
          factors_breakdown: Json | null
          id: string
          score_type: Database["public"]["Enums"]["score_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_score?: number | null
          factors_breakdown?: Json | null
          id?: string
          score_type: Database["public"]["Enums"]["score_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_score?: number | null
          factors_breakdown?: Json | null
          id?: string
          score_type?: Database["public"]["Enums"]["score_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_flags: {
        Row: {
          booking_id: string
          created_at: string | null
          flag_type: Database["public"]["Enums"]["flag_type"]
          id: string
          notes: string | null
          processed_for_upsell: boolean | null
          resi_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          flag_type: Database["public"]["Enums"]["flag_type"]
          id?: string
          notes?: string | null
          processed_for_upsell?: boolean | null
          resi_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          flag_type?: Database["public"]["Enums"]["flag_type"]
          id?: string
          notes?: string | null
          processed_for_upsell?: boolean | null
          resi_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_flags_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_flags_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_booking_settlement_status"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "service_flags_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_flags_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings_financials"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "service_flags_resi_id_fkey"
            columns: ["resi_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          address_id: string | null
          client_id: string
          common_area_id: string | null
          created_at: string | null
          discount_percentage: number | null
          frequency: Database["public"]["Enums"]["cleaning_frequency"]
          id: string
          next_billing_date: string | null
          plan_id: string
          preferred_resi_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"] | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string | null
        }
        Insert: {
          address_id?: string | null
          client_id: string
          common_area_id?: string | null
          created_at?: string | null
          discount_percentage?: number | null
          frequency: Database["public"]["Enums"]["cleaning_frequency"]
          id?: string
          next_billing_date?: string | null
          plan_id: string
          preferred_resi_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string | null
        }
        Update: {
          address_id?: string | null
          client_id?: string
          common_area_id?: string | null
          created_at?: string | null
          discount_percentage?: number | null
          frequency?: Database["public"]["Enums"]["cleaning_frequency"]
          id?: string
          next_billing_date?: string | null
          plan_id?: string
          preferred_resi_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_common_area_id_fkey"
            columns: ["common_area_id"]
            isOneToOne: false
            referencedRelation: "common_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_preferred_resi_id_fkey"
            columns: ["preferred_resi_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string | null
          verification_status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type?: string | null
          verification_status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          country_code: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          related_transaction_id: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          tenant_id: string | null
          type: Database["public"]["Enums"]["txn_type"]
          updated_at: string | null
          wallet_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          related_transaction_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          tenant_id?: string | null
          type: Database["public"]["Enums"]["txn_type"]
          updated_at?: string | null
          wallet_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          related_transaction_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          tenant_id?: string | null
          type?: Database["public"]["Enums"]["txn_type"]
          updated_at?: string | null
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_booking_settlement_status"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "v_bookings_financials"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "transactions_related_transaction_id_fkey"
            columns: ["related_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_related_transaction_id_fkey"
            columns: ["related_transaction_id"]
            isOneToOne: false
            referencedRelation: "v_bookings_financials"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "transactions_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          bathrooms: number | null
          bedrooms: number | null
          building_id: string
          created_at: string | null
          id: string
          sqm: number | null
          unit_number: string
        }
        Insert: {
          bathrooms?: number | null
          bedrooms?: number | null
          building_id: string
          created_at?: string | null
          id?: string
          sqm?: number | null
          unit_number: string
        }
        Update: {
          bathrooms?: number | null
          bedrooms?: number | null
          building_id?: string
          created_at?: string | null
          id?: string
          sqm?: number | null
          unit_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      upsell_offers: {
        Row: {
          client_id: string
          created_at: string | null
          discount_percentage: number | null
          expires_at: string | null
          id: string
          offer_name: string
          price: number
          status: Database["public"]["Enums"]["upsell_status"] | null
          trigger_flag_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          discount_percentage?: number | null
          expires_at?: string | null
          id?: string
          offer_name: string
          price: number
          status?: Database["public"]["Enums"]["upsell_status"] | null
          trigger_flag_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          discount_percentage?: number | null
          expires_at?: string | null
          id?: string
          offer_name?: string
          price?: number
          status?: Database["public"]["Enums"]["upsell_status"] | null
          trigger_flag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "upsell_offers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upsell_offers_trigger_flag_id_fkey"
            columns: ["trigger_flag_id"]
            isOneToOne: false
            referencedRelation: "service_flags"
            referencedColumns: ["id"]
          },
        ]
      }
      user_documents: {
        Row: {
          back_image_url: string | null
          created_at: string | null
          doc_number: string | null
          doc_type: Database["public"]["Enums"]["doc_type"]
          front_image_url: string | null
          id: string
          selfie_url: string | null
          tenant_id: string | null
          user_id: string
          verification_metadata: Json | null
          verified_at: string | null
        }
        Insert: {
          back_image_url?: string | null
          created_at?: string | null
          doc_number?: string | null
          doc_type: Database["public"]["Enums"]["doc_type"]
          front_image_url?: string | null
          id?: string
          selfie_url?: string | null
          tenant_id?: string | null
          user_id: string
          verification_metadata?: Json | null
          verified_at?: string | null
        }
        Update: {
          back_image_url?: string | null
          created_at?: string | null
          doc_number?: string | null
          doc_type?: Database["public"]["Enums"]["doc_type"]
          front_image_url?: string | null
          id?: string
          selfie_url?: string | null
          tenant_id?: string | null
          user_id?: string
          verification_metadata?: Json | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          last_name: string | null
          password_hash: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          last_name?: string | null
          password_hash?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          last_name?: string | null
          password_hash?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          building_id: string | null
          created_at: string | null
          desired_address: string | null
          desired_start: string | null
          id: string
          status: Database["public"]["Enums"]["waitlist_status"] | null
          user_id: string
        }
        Insert: {
          building_id?: string | null
          created_at?: string | null
          desired_address?: string | null
          desired_start?: string | null
          id?: string
          status?: Database["public"]["Enums"]["waitlist_status"] | null
          user_id: string
        }
        Update: {
          building_id?: string | null
          created_at?: string | null
          desired_address?: string | null
          desired_start?: string | null
          id?: string
          status?: Database["public"]["Enums"]["waitlist_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance_available: number | null
          balance_blocked: number | null
          country_code: string | null
          created_at: string | null
          currency: string | null
          id: string
          last_transaction_at: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          balance_available?: number | null
          balance_blocked?: number | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          last_transaction_at?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          balance_available?: number | null
          balance_blocked?: number | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          last_transaction_at?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      v_booking_settlement_status: {
        Row: {
          booking_id: string | null
          booking_status: Database["public"]["Enums"]["booking_status"] | null
          commission_amount: number | null
          overall_status: string | null
          provider_payout_amount: number | null
          settlement_status: string | null
          total_amount: number | null
        }
        Relationships: []
      }
      v_bookings: {
        Row: {
          amount_cents: number | null
          building_tenant_id: string | null
          client_tenant_id: string | null
          created_at: string | null
          id: string | null
          provider_tenant_id: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount_cents?: never
          building_tenant_id?: string | null
          client_tenant_id?: string | null
          created_at?: string | null
          id?: string | null
          provider_tenant_id?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount_cents?: never
          building_tenant_id?: string | null
          client_tenant_id?: string | null
          created_at?: string | null
          id?: string | null
          provider_tenant_id?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_building_tenant_id_fkey"
            columns: ["building_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_client_tenant_id_fkey"
            columns: ["client_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_tenant_id_fkey"
            columns: ["provider_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_subscription_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      v_bookings_financials: {
        Row: {
          amount_cents: number | null
          amount_numeric: number | null
          booking_id: string | null
          booking_status: Database["public"]["Enums"]["booking_status"] | null
          client_tenant_id: string | null
          ledger_amount_cents: number | null
          ledger_matches_booking: boolean | null
          ledger_matches_transaction: boolean | null
          provider_tenant_id: string | null
          transaction_amount: number | null
          transaction_created_at: string | null
          transaction_id: string | null
          transaction_status:
            | Database["public"]["Enums"]["transaction_status"]
            | null
          transaction_type: Database["public"]["Enums"]["txn_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_tenant_id_fkey"
            columns: ["client_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_tenant_id_fkey"
            columns: ["provider_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      v_wallets_preview: {
        Row: {
          balance_available: number | null
          balance_blocked: number | null
          created_at: string | null
          currency: string | null
          effective_balance: number | null
          id: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          balance_available?: never
          balance_blocked?: never
          created_at?: string | null
          currency?: string | null
          effective_balance?: never
          id?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          balance_available?: never
          balance_blocked?: never
          created_at?: string | null
          currency?: string | null
          effective_balance?: never
          id?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_tenant_fk"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      add_funds_intent: {
        Args: { p_amount: number; p_user_id: string }
        Returns: Json
      }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      can_access_booking_chat: {
        Args: { p_booking_id: string }
        Returns: boolean
      }
      claim_queue_events: {
        Args: { batch_size: number }
        Returns: {
          created_at: string | null
          delivered_at: string | null
          id: string
          payload: Json
          retry_count: number | null
          status: string
          topic: string
          type: string
          updated_at: string | null
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "queue_events"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      close_service_financials: {
        Args: {
          p_booking_id: string
          p_force: boolean
          p_include_tip_cents: number
          p_initiator_user_id: string
        }
        Returns: Json
      }
      confirm_payment: {
        Args: { p_payment_intent_id: string; p_user_id: string }
        Returns: Json
      }
      create_booking_with_lock: {
        Args: {
          p_address_id: string
          p_amount_cents: number
          p_booking_type: string
          p_building_tenant_id: string
          p_client_tenant_id: string
          p_created_by: string
          p_payout_cents: number
          p_provider_tenant_id: string
          p_scheduled_at: string
          p_service_id: string
        }
        Returns: Json
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_and_lock_pending_payouts: {
        Args: { p_limit?: number }
        Returns: {
          amount_cents: number
          booking_id: string
          created_at: string
          currency: string
          destination_account: Json
          id: string
          idempotency_key: string
          last_attempt_at: string | null
          last_error: Json | null
          next_attempt_at: string | null
          processing_worker_id: string | null
          provider_id: string
          retry_count: number
          status: string
          tenant_id: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "payout_jobs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_country_config: { Args: { p_country_code: string }; Returns: Json }
      get_current_tenant_id: { Args: never; Returns: string }
      get_my_tenant_id: { Args: never; Returns: string }
      get_user_tenant: { Args: never; Returns: string }
      get_wallet_balance: { Args: { p_user_id: string }; Returns: Json }
      gettransactionid: { Args: never; Returns: unknown }
      invoke_queue_worker: { Args: never; Returns: undefined }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      preview_close_service_financials: {
        Args: { p_booking_id: string }
        Returns: Json
      }
      process_refund: {
        Args: {
          p_booking_id: string
          p_idempotency_key?: string
          p_reason: string
        }
        Returns: undefined
      }
      reconciliation_backfill_batch: {
        Args: { p_limit?: number }
        Returns: number
      }
      recover_stuck_queue_events: { Args: never; Returns: undefined }
      request_payout: {
        Args: {
          p_amount: number
          p_idempotency_key: string
          p_tenant_id: string
        }
        Returns: string
      }
      request_withdrawal: {
        Args: { p_amount: number; p_bank_account_id: string; p_user_id: string }
        Returns: Json
      }
      reset_stale_processing_events: {
        Args: { timeout_minutes?: number }
        Returns: number
      }
      schedule_payout_for_booking:
        | { Args: { p_booking_id: string }; Returns: string }
        | {
            Args: { p_booking_id: string; p_currency?: string; p_net: number }
            Returns: undefined
          }
      settle_booking_financials: {
        Args: {
          p_booking_id: string
          p_force?: boolean
          p_initiator_user_id: string
          p_request_id?: string
        }
        Returns: Json
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      account_type: "PERSONAL" | "BUSINESS"
      booking_status:
        | "SCHEDULED"
        | "ASSIGNED"
        | "EN_ROUTE"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELED"
        | "NO_SHOW"
        | "REQUESTED"
        | "CONFIRMED"
        | "CANCELLED"
      booking_type: "RESIDENTIAL" | "COMMON_AREA" | "DEEP_CLEAN"
      cleaning_frequency: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY"
      doc_type: "DNI" | "PASSPORT" | "CE" | "RUC"
      flag_type:
        | "DEEP_CLEAN_KITCHEN"
        | "PET_MESS"
        | "CLUTTER"
        | "REPAIR_NEEDED"
        | "COMMON_AREA_ISSUE"
      incident_category:
        | "QUALITY"
        | "DAMAGE"
        | "NO_SHOW"
        | "ACCESS_ISSUE"
        | "OTHER"
      incident_priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      incident_status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
      invoice_status: "DRAFT" | "SENT" | "PAID" | "OVERDUE"
      kyc_status: "PENDING" | "APPROVED" | "REJECTED" | "MANUAL_REVIEW"
      loan_status: "ACTIVE" | "PAID" | "DEFAULT"
      partnership_status: "PROSPECT" | "ACTIVE" | "PAUSED" | "TERMINATED"
      plan_type: "RESIDENTIAL" | "COMMON_AREA"
      referral_status: "PENDING" | "CONVERTED" | "PAID_OUT"
      score_type:
        | "RESI_PERFORMANCE"
        | "CLIENT_RELIABILITY"
        | "LANDLORD_PARTNERSHIP"
      subscription_status: "ACTIVE" | "PAUSED" | "CANCELED" | "PAST_DUE"
      subscription_type: "RESIDENTIAL" | "COMMON_AREA"
      transaction_status: "PENDING" | "COMPLETED" | "FAILED"
      transaction_type:
        | "DEPOSIT"
        | "WITHDRAWAL"
        | "PAYOUT"
        | "LOAN_DISBURSEMENT"
        | "LOAN_REPAYMENT"
        | "FEE"
        | "LANDLORD_COMMISSION"
      txn_type: "SERVICE_PAYMENT" | "FEE" | "PAYOUT" | "ADJUSTMENT" | "REFUND"
      upsell_status: "SENT" | "VIEWED" | "CONVERTED" | "EXPIRED"
      user_role: "CLIENT" | "RESI" | "LANDLORD" | "ADMIN"
      waitlist_status: "WAITING" | "CONTACTED" | "CONVERTED" | "EXPIRED"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["PERSONAL", "BUSINESS"],
      booking_status: [
        "SCHEDULED",
        "ASSIGNED",
        "EN_ROUTE",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELED",
        "NO_SHOW",
        "REQUESTED",
        "CONFIRMED",
        "CANCELLED",
      ],
      booking_type: ["RESIDENTIAL", "COMMON_AREA", "DEEP_CLEAN"],
      cleaning_frequency: ["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"],
      doc_type: ["DNI", "PASSPORT", "CE", "RUC"],
      flag_type: [
        "DEEP_CLEAN_KITCHEN",
        "PET_MESS",
        "CLUTTER",
        "REPAIR_NEEDED",
        "COMMON_AREA_ISSUE",
      ],
      incident_category: [
        "QUALITY",
        "DAMAGE",
        "NO_SHOW",
        "ACCESS_ISSUE",
        "OTHER",
      ],
      incident_priority: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      incident_status: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      invoice_status: ["DRAFT", "SENT", "PAID", "OVERDUE"],
      kyc_status: ["PENDING", "APPROVED", "REJECTED", "MANUAL_REVIEW"],
      loan_status: ["ACTIVE", "PAID", "DEFAULT"],
      partnership_status: ["PROSPECT", "ACTIVE", "PAUSED", "TERMINATED"],
      plan_type: ["RESIDENTIAL", "COMMON_AREA"],
      referral_status: ["PENDING", "CONVERTED", "PAID_OUT"],
      score_type: [
        "RESI_PERFORMANCE",
        "CLIENT_RELIABILITY",
        "LANDLORD_PARTNERSHIP",
      ],
      subscription_status: ["ACTIVE", "PAUSED", "CANCELED", "PAST_DUE"],
      subscription_type: ["RESIDENTIAL", "COMMON_AREA"],
      transaction_status: ["PENDING", "COMPLETED", "FAILED"],
      transaction_type: [
        "DEPOSIT",
        "WITHDRAWAL",
        "PAYOUT",
        "LOAN_DISBURSEMENT",
        "LOAN_REPAYMENT",
        "FEE",
        "LANDLORD_COMMISSION",
      ],
      txn_type: ["SERVICE_PAYMENT", "FEE", "PAYOUT", "ADJUSTMENT", "REFUND"],
      upsell_status: ["SENT", "VIEWED", "CONVERTED", "EXPIRED"],
      user_role: ["CLIENT", "RESI", "LANDLORD", "ADMIN"],
      waitlist_status: ["WAITING", "CONTACTED", "CONVERTED", "EXPIRED"],
    },
  },
} as const
