export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chat: {
        Row: {
          created_at: string
          id: string
          industry: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          industry?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_completion: {
        Row: {
          chat_id: string | null
          completion_tokens: number | null
          created: number | null
          created_at: string
          documents: string[] | null
          finish_reason: string | null
          id: string
          message: string
          model: string | null
          object: string | null
          prompt: string | null
          prompt_tokens: number | null
          role: string | null
          suggested_prompts: Json | null
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          chat_id?: string | null
          completion_tokens?: number | null
          created?: number | null
          created_at?: string
          documents?: string[] | null
          finish_reason?: string | null
          id: string
          message: string
          model?: string | null
          object?: string | null
          prompt?: string | null
          prompt_tokens?: number | null
          role?: string | null
          suggested_prompts?: Json | null
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          chat_id?: string | null
          completion_tokens?: number | null
          created?: number | null
          created_at?: string
          documents?: string[] | null
          finish_reason?: string | null
          id?: string
          message?: string
          model?: string | null
          object?: string | null
          prompt?: string | null
          prompt_tokens?: number | null
          role?: string | null
          suggested_prompts?: Json | null
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_chat_completion_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_chat: {
        Row: {
          created_at: string
          id: string
          organization: string | null
          session_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id: string
          organization?: string | null
          session_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          organization?: string | null
          session_id?: string | null
          title?: string | null
        }
        Relationships: []
      }
      chatbot_message: {
        Row: {
          chat_id: string | null
          content: string
          created_at: string
          default_prompts: Json[] | null
          id: string
          links: string | null
          role: string | null
          suggested_prompts: string | null
          suggested_prompts_json: Json[] | null
        }
        Insert: {
          chat_id?: string | null
          content: string
          created_at?: string
          default_prompts?: Json[] | null
          id: string
          links?: string | null
          role?: string | null
          suggested_prompts?: string | null
          suggested_prompts_json?: Json[] | null
        }
        Update: {
          chat_id?: string | null
          content?: string
          created_at?: string
          default_prompts?: Json[] | null
          id?: string
          links?: string | null
          role?: string | null
          suggested_prompts?: string | null
          suggested_prompts_json?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "public_chatbot_chat_completion_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chatbot_chat"
            referencedColumns: ["id"]
          },
        ]
      }
      completion_feedback: {
        Row: {
          chat_id: string | null
          completion: string | null
          completion_id: string | null
          created_at: string
          id: string
          prompt: string | null
          rating: string | null
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          completion?: string | null
          completion_id?: string | null
          created_at?: string
          id?: string
          prompt?: string | null
          rating?: string | null
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          completion?: string | null
          completion_id?: string | null
          created_at?: string
          id?: string
          prompt?: string | null
          rating?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Development: {
        Row: {
          created_at: string
          id: number
          text: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          text?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          text?: string | null
        }
        Relationships: []
      }
      higgins_ai_public_organization: {
        Row: {
          created_at: string
          greeting: string | null
          id: string
          name: string | null
          system_directive: string | null
          temperature: number | null
        }
        Insert: {
          created_at?: string
          greeting?: string | null
          id?: string
          name?: string | null
          system_directive?: string | null
          temperature?: number | null
        }
        Update: {
          created_at?: string
          greeting?: string | null
          id?: string
          name?: string | null
          system_directive?: string | null
          temperature?: number | null
        }
        Relationships: []
      }
      higgins_chat: {
        Row: {
          created_at: string
          id: string
          organization: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          organization?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      higgins_chat_completion: {
        Row: {
          chat_id: string | null
          completion_tokens: number | null
          created: number | null
          created_at: string
          documents: string[] | null
          finish_reason: string | null
          id: string
          message: string
          model: string | null
          object: string | null
          prompt: string | null
          prompt_tokens: number | null
          role: string | null
          suggested_prompts: Json | null
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          chat_id?: string | null
          completion_tokens?: number | null
          created?: number | null
          created_at?: string
          documents?: string[] | null
          finish_reason?: string | null
          id: string
          message: string
          model?: string | null
          object?: string | null
          prompt?: string | null
          prompt_tokens?: number | null
          role?: string | null
          suggested_prompts?: Json | null
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          chat_id?: string | null
          completion_tokens?: number | null
          created?: number | null
          created_at?: string
          documents?: string[] | null
          finish_reason?: string | null
          id?: string
          message?: string
          model?: string | null
          object?: string | null
          prompt?: string | null
          prompt_tokens?: number | null
          role?: string | null
          suggested_prompts?: Json | null
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_higgins_chat_completion_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "higgins_chat"
            referencedColumns: ["id"]
          },
        ]
      }
      higgins_public_chat: {
        Row: {
          created_at: string
          id: string
          organization_id: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          organization_id?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_higgins_public_chat_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "higgins_ai_public_organization"
            referencedColumns: ["id"]
          },
        ]
      }
      higgins_public_chat_completion: {
        Row: {
          chat_id: string | null
          completion_tokens: number | null
          created: number | null
          created_at: string
          documents: string[] | null
          finish_reason: string | null
          id: string
          message: string
          model: string | null
          object: string | null
          prompt: string | null
          prompt_tokens: number | null
          role: string | null
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          chat_id?: string | null
          completion_tokens?: number | null
          created?: number | null
          created_at?: string
          documents?: string[] | null
          finish_reason?: string | null
          id: string
          message: string
          model?: string | null
          object?: string | null
          prompt?: string | null
          prompt_tokens?: number | null
          role?: string | null
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          chat_id?: string | null
          completion_tokens?: number | null
          created?: number | null
          created_at?: string
          documents?: string[] | null
          finish_reason?: string | null
          id?: string
          message?: string
          model?: string | null
          object?: string | null
          prompt?: string | null
          prompt_tokens?: number | null
          role?: string | null
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_higgins_public_chat_completion_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "higgins_public_chat"
            referencedColumns: ["id"]
          },
        ]
      }
      industry: {
        Row: {
          completion_temperature: number | null
          created_at: string
          greeting: string | null
          id: string
          name: string | null
          system_directive: string | null
        }
        Insert: {
          completion_temperature?: number | null
          created_at?: string
          greeting?: string | null
          id?: string
          name?: string | null
          system_directive?: string | null
        }
        Update: {
          completion_temperature?: number | null
          created_at?: string
          greeting?: string | null
          id?: string
          name?: string | null
          system_directive?: string | null
        }
        Relationships: []
      }
      organization: {
        Row: {
          completion_temperature: number | null
          created_at: string
          default_prompts: Json[] | null
          greeting: string | null
          id: string
          name: string | null
          path_identifier_phrase: string | null
          system_directive: string | null
        }
        Insert: {
          completion_temperature?: number | null
          created_at?: string
          default_prompts?: Json[] | null
          greeting?: string | null
          id?: string
          name?: string | null
          path_identifier_phrase?: string | null
          system_directive?: string | null
        }
        Update: {
          completion_temperature?: number | null
          created_at?: string
          default_prompts?: Json[] | null
          greeting?: string | null
          id?: string
          name?: string | null
          path_identifier_phrase?: string | null
          system_directive?: string | null
        }
        Relationships: []
      }
      organization_testing: {
        Row: {
          completion_temperature: number | null
          created_at: string
          default_prompts: Json[] | null
          greeting: string | null
          id: string
          name: string | null
          path_identifier_phrase: string | null
          system_directive: string | null
        }
        Insert: {
          completion_temperature?: number | null
          created_at?: string
          default_prompts?: Json[] | null
          greeting?: string | null
          id?: string
          name?: string | null
          path_identifier_phrase?: string | null
          system_directive?: string | null
        }
        Update: {
          completion_temperature?: number | null
          created_at?: string
          default_prompts?: Json[] | null
          greeting?: string | null
          id?: string
          name?: string | null
          path_identifier_phrase?: string | null
          system_directive?: string | null
        }
        Relationships: []
      }
      public_chat: {
        Row: {
          created_at: string
          id: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      public_chat_completion: {
        Row: {
          chat_id: string | null
          completion_tokens: number | null
          created: number | null
          created_at: string
          finish_reason: string | null
          id: string
          message: string
          model: string | null
          object: string | null
          prompt: string | null
          prompt_tokens: number | null
          role: string | null
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          chat_id?: string | null
          completion_tokens?: number | null
          created?: number | null
          created_at?: string
          finish_reason?: string | null
          id: string
          message: string
          model?: string | null
          object?: string | null
          prompt?: string | null
          prompt_tokens?: number | null
          role?: string | null
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          chat_id?: string | null
          completion_tokens?: number | null
          created?: number | null
          created_at?: string
          finish_reason?: string | null
          id?: string
          message?: string
          model?: string | null
          object?: string | null
          prompt?: string | null
          prompt_tokens?: number | null
          role?: string | null
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_public_chat_completion_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "public_chat"
            referencedColumns: ["id"]
          },
        ]
      }
      public_completion_feedback: {
        Row: {
          chat_id: string | null
          completion: string | null
          completion_id: string | null
          created_at: string
          id: string
          prompt: string | null
          rating: string | null
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          completion?: string | null
          completion_id?: string | null
          created_at?: string
          id?: string
          prompt?: string | null
          rating?: string | null
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          completion?: string | null
          completion_id?: string | null
          created_at?: string
          id?: string
          prompt?: string | null
          rating?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
