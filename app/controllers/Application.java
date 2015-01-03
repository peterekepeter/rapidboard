package controllers;

import play.*;
import play.mvc.*;

import views.html.*;

public class Application extends Controller {

	private static long hitCounter = 0;

    public static Result index() {
		hitCounter ++;
		session("Cat","3");
        return ok(index.render("Hits: " + hitCounter));
    }

}
