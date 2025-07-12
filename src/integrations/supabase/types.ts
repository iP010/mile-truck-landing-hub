export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string | null
          expires_at: string
          id: string
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          expires_at: string
          id?: string
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
          role: Database["public"]["Enums"]["admin_role"] | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
          role?: Database["public"]["Enums"]["admin_role"] | null
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["admin_role"] | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          company_name: string
          created_at: string
          has_insurance: boolean
          id: string
          insurance_type: string | null
          manager_name: string
          phone_number: string
          truck_count: number
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          company_name: string
          created_at?: string
          has_insurance?: boolean
          id?: string
          insurance_type?: string | null
          manager_name: string
          phone_number: string
          truck_count: number
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          company_name?: string
          created_at?: string
          has_insurance?: boolean
          id?: string
          insurance_type?: string | null
          manager_name?: string
          phone_number?: string
          truck_count?: number
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      companies_pricing: {
        Row: {
          company_name: string
          created_at: string
          id: string
          insurance_type: string | null
          is_editing_enabled: boolean
          membership_number: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          id?: string
          insurance_type?: string | null
          is_editing_enabled?: boolean
          membership_number: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          insurance_type?: string | null
          is_editing_enabled?: boolean
          membership_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_registration_settings: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      company_waitlist: {
        Row: {
          company_name: string
          created_at: string
          id: string
          manager_name: string
          phone_number: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          company_name: string
          created_at?: string
          id?: string
          manager_name: string
          phone_number: string
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          manager_name?: string
          phone_number?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      driver_nationalities: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      driver_registration_settings: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      driver_waitlist: {
        Row: {
          created_at: string
          driver_name: string
          id: string
          phone_number: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          created_at?: string
          driver_name: string
          id?: string
          phone_number: string
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          created_at?: string
          driver_name?: string
          id?: string
          phone_number?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          created_at: string
          driver_name: string
          has_insurance: boolean
          id: string
          insurance_type: string | null
          invitation_code: string | null
          nationality: string
          phone_number: string
          referral_code: string | null
          truck_brand: string
          truck_type: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          created_at?: string
          driver_name: string
          has_insurance?: boolean
          id?: string
          insurance_type?: string | null
          invitation_code?: string | null
          nationality: string
          phone_number: string
          referral_code?: string | null
          truck_brand: string
          truck_type: string
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          created_at?: string
          driver_name?: string
          has_insurance?: boolean
          id?: string
          insurance_type?: string | null
          invitation_code?: string | null
          nationality?: string
          phone_number?: string
          referral_code?: string | null
          truck_brand?: string
          truck_type?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      insurance_types: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      trip_pricing: {
        Row: {
          company_pricing_id: string
          created_at: string
          from_city: string
          id: string
          price: number | null
          to_city: string
          trip_type: string
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          company_pricing_id: string
          created_at?: string
          from_city: string
          id?: string
          price?: number | null
          to_city: string
          trip_type?: string
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          company_pricing_id?: string
          created_at?: string
          from_city?: string
          id?: string
          price?: number | null
          to_city?: string
          trip_type?: string
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_pricing_company_pricing_id_fkey"
            columns: ["company_pricing_id"]
            isOneToOne: false
            referencedRelation: "companies_pricing"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_brands: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      truck_types: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicle_types: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      dashboard_stats: {
        Row: {
          active_pricing_companies: number | null
          companies_with_insurance: number | null
          drivers_with_insurance: number | null
          total_companies: number | null
          total_drivers: number | null
          total_pricing_companies: number | null
          total_trip_prices: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_admin_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_orphaned_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_membership_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_admin_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "supervisor"
    }
    CompositeTypes: {
      [_ in never]: never
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
      admin_role: ["super_admin", "admin", "supervisor"],
    },
  },
} as const
