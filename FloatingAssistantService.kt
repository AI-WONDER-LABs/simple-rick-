package com.simplerickai

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.*
import android.widget.*

class FloatingAssistantService : Service() {
    private lateinit var windowManager: WindowManager
    private lateinit var floatingView: View
    private lateinit var params: WindowManager.LayoutParams
    
    // UI Components
    private lateinit var collapsedView: View
    private lateinit var expandedView: View
    private lateinit var chatContainer: LinearLayout
    private lateinit var inputField: EditText
    
    // State
    private var isExpanded = false

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()
        
        // 1. Inflate the UI
        floatingView = LayoutInflater.from(this).inflate(R.layout.layout_floating_widget, null)
        
        // 2. Configure the Window Parameters (The Overlay Magic)
        val layoutFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        }
        
        params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutFlag,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE, // Allows touch behind the window
            PixelFormat.TRANSLUCENT
        )
        
        // Initial position
        params.gravity = Gravity.TOP or Gravity.START
        params.x = 0
        params.y = 100
        
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        windowManager.addView(floatingView, params)
        
        // 3. Initialize Views
        collapsedView = floatingView.findViewById(R.id.collapse_view)
        expandedView = floatingView.findViewById(R.id.expanded_container)
        chatContainer = floatingView.findViewById(R.id.chat_history_container)
        inputField = floatingView.findViewById(R.id.input_query)
        val closeBtn = floatingView.findViewById<ImageView>(R.id.close_btn)
        val sendBtn = floatingView.findViewById<ImageView>(R.id.send_btn)
        val rootContainer = floatingView.findViewById<View>(R.id.root_container)
        
        // 4. Handle Dragging and Expansion
        rootContainer.setOnTouchListener(object : View.OnTouchListener {
            private var initialX = 0
            private var initialY = 0
            private var initialTouchX = 0f
            private var initialTouchY = 0f
            
            override fun onTouch(v: View, event: MotionEvent): Boolean {
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        initialX = params.x
                        initialY = params.y
                        initialTouchX = event.rawX
                        initialTouchY = event.rawY
                        return true
                    }
                    
                    MotionEvent.ACTION_UP -> {
                        val Xdiff = (event.rawX - initialTouchX).toInt()
                        val Ydiff = (event.rawY - initialTouchY).toInt()
                        
                        // If user didn't drag much, treat it as a click
                        if (Xdiff < 10 && Ydiff < 10) {
                            if (!isExpanded) {
                                expandView()
                            }
                            return true
                        }
                    }
                    
                    MotionEvent.ACTION_MOVE -> {
                        params.x = initialX + (event.rawX - initialTouchX).toInt()
                        params.y = initialY + (event.rawY - initialTouchY).toInt()
                        windowManager.updateViewLayout(floatingView, params)
                        return true
                    }
                }
                return false
            }
        })
        
        // 5. Button Listeners
        closeBtn.setOnClickListener { collapseView() }
        
        sendBtn.setOnClickListener {
            val query = inputField.text.toString()
            if (query.isNotEmpty()) {
                addMessageToChat("User: $query", true)
                inputField.setText("")
                
                // Process AI Response
                processAIResponse(query)
            }
        }
        
        // Needed to allow typing in the EditText
        inputField.setOnTouchListener { v, event ->
            v.onTouchEvent(event)
            
            // When typing, we need to make the window focusable so the keyboard appears
            params.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                          WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH
            windowManager.updateViewLayout(floatingView, params)
            true
        }
    }
    
    private fun processAIResponse(query: String) {
        // Simulating "Simple Rick" persona
        val response = when {
            query.contains("error") -> "Rick: Looks like a NullPointer. Check line 42, Morty."
            query.contains("loop") -> "Rick: You missed the increment condition. Rookie mistake."
            else -> "Rick: I'm processing that code snippet. Give me a second."
        }
        
        // Simulate network delay
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            addMessageToChat(response, false)
        }, 1000)
    }
    
    private fun addMessageToChat(text: String, isUser: Boolean) {
        val textView = TextView(this)
        textView.text = text
        textView.textSize = 14f
        textView.setPadding(16, 8, 16, 8)
        textView.setTextColor(if (isUser) 0xFFFFFFFF.toInt() else 0xFF00FF00.toInt())
        textView.typeface = android.graphics.Typeface.MONOSPACE
        chatContainer.addView(textView)
    }
    
    private fun expandView() {
        collapsedView.visibility = View.GONE
        expandedView.visibility = View.VISIBLE
        isExpanded = true
        
        // Enable focus so keyboard works
        params.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
        
        // Resize to bigger window (30% of screen width as requested)
        params.width = (resources.displayMetrics.widthPixels * 0.3).toInt()
        params.height = 800
        windowManager.updateViewLayout(floatingView, params)
    }
    
    private fun collapseView() {
        collapsedView.visibility = View.VISIBLE
        expandedView.visibility = View.GONE
        isExpanded = false
        
        // Disable focus so clicks pass through outside the icon
        params.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
        params.width = WindowManager.LayoutParams.WRAP_CONTENT
        params.height = WindowManager.LayoutParams.WRAP_CONTENT
        windowManager.updateViewLayout(floatingView, params)
    }
    
    override fun onDestroy() {
        super.onDestroy()
        if (::floatingView.isInitialized) {
            windowManager.removeView(floatingView)
        }
    }
}
