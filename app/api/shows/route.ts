import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: shows, error } = await supabase
      .from("shows")
      .select("*")
      .eq("is_active", true)
      .order("date", { ascending: true })
    
    if (error) {
      console.error("Error fetching shows:", error)
      return NextResponse.json({ shows: [] })
    }
    
    return NextResponse.json({ shows })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ shows: [] })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await request.json()
    
    const { data: show, error } = await supabase
      .from("shows")
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error("Error creating show:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ show })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await request.json()
    const { id, ...updates } = body
    
    const { data: show, error } = await supabase
      .from("shows")
      .update(updates)
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating show:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ show })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    
    const { error } = await supabase
      .from("shows")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting show:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
