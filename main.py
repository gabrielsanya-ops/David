#!/usr/bin/env python3
"""
Tumaini Fuel Station Management System
Main Application Entry Point
"""

import sys
import os
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.ui.main_window import MainWindow
from src.utils.logger import setup_logger

def main():
    """Main application entry point"""
    try:
        # Setup logging
        logger = setup_logger()
        logger.info("Starting Tumaini Fuel Station Management System")
        
        # Create QApplication
        app = QApplication(sys.argv)
        app.setApplicationName("Tumaini Fuel Station Management System")
        app.setApplicationVersion("1.0.0")
        app.setOrganizationName("Tumaini Fuel Station")
        
        # Set application font
        font = QFont("Segoe UI", 9)
        app.setFont(font)
        
        # Enable high DPI scaling
        app.setAttribute(Qt.AA_EnableHighDpiScaling, True)
        app.setAttribute(Qt.AA_UseHighDpiPixmaps, True)
        
        # Create and show main window
        main_window = MainWindow()
        main_window.show()
        
        logger.info("Application started successfully")
        
        # Start event loop
        sys.exit(app.exec_())
        
    except Exception as e:
        print(f"Error starting application: {e}")
        if 'logger' in locals():
            logger.error(f"Error starting application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
