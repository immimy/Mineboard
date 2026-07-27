export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      boards: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          board_id: string
          color: number
          created_at: string
          id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          board_id: string
          color?: number
          created_at?: string
          id?: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          board_id?: string
          color?: number
          created_at?: string
          id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      list_fields: {
        Row: {
          board_id: string
          config: Json | null
          created_at: string
          id: string
          position: number
          type: Database["public"]["Enums"]["field_type"]
          updated_at: string
        }
        Insert: {
          board_id: string
          config?: Json | null
          created_at?: string
          id?: string
          position?: number
          type: Database["public"]["Enums"]["field_type"]
          updated_at?: string
        }
        Update: {
          board_id?: string
          config?: Json | null
          created_at?: string
          id?: string
          position?: number
          type?: Database["public"]["Enums"]["field_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_fields_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      list_values: {
        Row: {
          created_at: string
          id: string
          list_field_id: string
          list_id: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          list_field_id: string
          list_id: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          list_field_id?: string
          list_id?: string
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "list_values_list_field_id_fkey"
            columns: ["list_field_id"]
            isOneToOne: false
            referencedRelation: "list_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_values_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          card_id: string
          created_at: string
          id: string
          position: number
          updated_at: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          position?: number
          updated_at?: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_cloudinary_deletion_jobs: {
        Args: {
          p_batch_size?: number
          p_claim_token: string
          p_claim_ttl_seconds?: number
        }
        Returns: {
          public_id: string
        }[]
      }
      create_board: { Args: { p_title: string }; Returns: string }
      create_card: {
        Args: { p_board_id: string; p_color: unknown; p_title: string }
        Returns: string
      }
      create_list_fields: {
        Args: { p_board_id: string; p_fields: Json }
        Returns: string
      }
      create_list_with_values: {
        Args: { p_card_id: string; p_field_values: Json }
        Returns: string
      }
      finish_cloudinary_deletion_jobs: {
        Args: {
          p_claim_token: string
          p_error?: string
          p_failed_public_ids?: string[]
          p_succeeded_public_ids?: string[]
        }
        Returns: {
          completed: number
          retried: number
        }[]
      }
      get_referenced_image_public_ids: {
        Args: { p_public_ids?: string[] }
        Returns: {
          public_id: string
        }[]
      }
      is_safe_jsonb: { Args: { data: Json }; Returns: boolean }
      update_list: {
        Args: {
          p_delete_values?: string[]
          p_insert_values?: Json
          p_list_id: string
          p_update_values?: Json
        }
        Returns: string
      }
      update_list_fields: {
        Args: {
          p_board_id: string
          p_delete_field_ids?: string[]
          p_fields?: Json
        }
        Returns: string
      }
    }
    Enums: {
      field_type: "text" | "number" | "date" | "image" | "checkbox" | "tag"
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
      field_type: ["text", "number", "date", "image", "checkbox", "tag"],
    },
  },
} as const

